import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Challenge, Prisma, Plan, PlanStatus } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import {
  AdaptationContext,
  GeneratedChallenge,
  PlanGenerationContext,
} from '../ai/ai.types';
import { getCurrentPeriod } from '../common/season.util';
import { currentWeekFor, progressFor } from '../common/plan-response.util';
import { PrismaService } from '../prisma/prisma.service';
import { AdaptPlanDto } from './dto/adapt-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { NextPlanDto } from './dto/next-plan.dto';

type PlanWithChallenges = Plan & { challenges: Challenge[] };

@Injectable()
export class PlansService {
  private readonly logger = new Logger(PlansService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async create(dto: CreatePlanDto) {
    const period = getCurrentPeriod();
    const context = this.contextFromDto(dto, period);
    this.logger.log('Plan generation started');
    const generated = await this.ai.generatePlan(context);
    const plan = await this.prisma.plan.create({
      data: {
        periodType: 'MONTH',
        month: period.month,
        year: period.year,
        season: period.season,
        title: generated.title,
        location: dto.location,
        preferences: context as unknown as Prisma.InputJsonValue,
        target: generated.target,
        challenges: {
          create: generated.challenges.map((challenge) =>
            this.challengeData(challenge),
          ),
        },
      },
      include: { challenges: true },
    });
    this.logger.log(`Plan generation completed: ${plan.id}`);
    return this.toResponse(plan);
  }

  async current(planId?: string) {
    const plan = planId
      ? await this.prisma.plan.findUnique({
          where: { id: planId },
          include: { challenges: true },
        })
      : await this.prisma.plan.findFirst({
          orderBy: { createdAt: 'desc' },
          include: { challenges: true },
        });
    if (!plan) throw new NotFoundException('Plan not found.');
    return this.toResponse(plan);
  }

  async getById(id: string): Promise<PlanWithChallenges> {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: { challenges: true },
    });
    if (!plan) throw new NotFoundException('Plan not found.');
    return plan;
  }

  async adapt(id: string, dto: AdaptPlanDto) {
    const plan = await this.getById(id);
    const incomplete = plan.challenges.filter(
      (challenge) => !challenge.completed,
    );
    if (incomplete.length === 0)
      throw new ConflictException('A completed plan cannot be adapted.');
    const context: AdaptationContext = {
      preferences: plan.preferences as unknown as PlanGenerationContext,
      incomplete: incomplete.map((challenge) => ({
        ...this.asGenerated(challenge),
        id: challenge.id,
      })),
      completed: plan.challenges
        .filter((challenge) => challenge.completed)
        .map((challenge) => ({
          ...this.asGenerated(challenge),
          id: challenge.id,
          note: challenge.note,
        })),
      constraint: dto.constraint,
    };
    const adapted = await this.ai.adaptChallenges(context);
    await this.prisma.$transaction(
      adapted.challenges.map((challenge) =>
        this.prisma.challenge.update({
          where: { id: challenge.id },
          data: this.challengeData(challenge),
        }),
      ),
    );
    return this.current(id);
  }

  async next(id: string, dto: NextPlanDto) {
    const previous = await this.getById(id);
    const period = getCurrentPeriod();
    const preferences =
      previous.preferences as unknown as PlanGenerationContext;
    const modeAdjustment =
      dto.mode === 'new'
        ? ['new_variety', ...preferences.interests]
        : dto.mode === 'surprise'
          ? ['surprise_me']
          : preferences.interests;
    const generated = await this.ai.generatePlan({
      ...preferences,
      interests: modeAdjustment,
      month: period.month,
      year: period.year,
      season: period.season,
    });
    const plan = await this.prisma.plan.create({
      data: {
        periodType: 'MONTH',
        month: period.month,
        year: period.year,
        season: period.season,
        title: generated.title,
        location: previous.location,
        preferences: {
          ...preferences,
          interests: modeAdjustment,
          mode: dto.mode,
        },
        target: generated.target,
        challenges: {
          create: generated.challenges.map((challenge) =>
            this.challengeData(challenge),
          ),
        },
      },
      include: { challenges: true },
    });
    return this.toResponse(plan);
  }

  toResponse(plan: PlanWithChallenges) {
    return {
      id: plan.id,
      periodType: plan.periodType,
      month: plan.month,
      year: plan.year,
      season: plan.season,
      title: plan.title,
      location: plan.location,
      target: plan.target,
      status: plan.status,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      completedAt: plan.completedAt,
      progress: progressFor(plan.challenges),
      currentWeek: currentWeekFor(plan),
      challenges: plan.challenges,
    };
  }

  async refreshStatus(
    planId: string,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const challenges = await tx.challenge.findMany({ where: { planId } });
    const completed =
      challenges.length > 0 &&
      challenges.every((challenge) => challenge.completed);
    return tx.plan.update({
      where: { id: planId },
      data: completed
        ? { status: PlanStatus.COMPLETED, completedAt: new Date() }
        : { status: PlanStatus.ACTIVE, completedAt: null },
    });
  }

  private contextFromDto(
    dto: CreatePlanDto,
    period: ReturnType<typeof getCurrentPeriod>,
  ): PlanGenerationContext {
    return {
      location: dto.location,
      interests: dto.interests,
      frequency: dto.frequency,
      timePerDay: dto.availableTime,
      motivations: dto.motivations,
      ...period,
    };
  }

  private challengeData(challenge: GeneratedChallenge) {
    return {
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      estimatedMinutes: challenge.estimatedMinutes,
      difficulty: challenge.difficulty,
      weekNumber: challenge.weekNumber,
    };
  }

  private asGenerated(challenge: Challenge): GeneratedChallenge {
    return {
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      estimatedMinutes: challenge.estimatedMinutes,
      difficulty: challenge.difficulty,
      weekNumber: challenge.weekNumber,
    };
  }
}
