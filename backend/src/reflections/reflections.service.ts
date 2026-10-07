import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Challenge } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { PlanGenerationContext, ReflectionContext } from '../ai/ai.types';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class ReflectionsService {
  private readonly logger = new Logger(ReflectionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly plans: PlansService,
    private readonly ai: AiService,
  ) {}

  async generate(planId: string) {
    const plan = await this.plans.getById(planId);
    const existing = await this.prisma.reflection.findUnique({
      where: { planId },
    });
    if (existing) return existing;
    if (
      plan.challenges.length === 0 ||
      plan.challenges.some((challenge) => !challenge.completed)
    ) {
      throw new ConflictException(
        'Reflection is available only after all challenges are complete.',
      );
    }
    const context: ReflectionContext = {
      preferences: plan.preferences as unknown as PlanGenerationContext,
      challenges: plan.challenges.map((challenge: Challenge) => ({
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        estimatedMinutes: challenge.estimatedMinutes,
        difficulty: challenge.difficulty,
        weekNumber: challenge.weekNumber,
        completed: challenge.completed,
        note: challenge.note,
      })),
    };
    const content = await this.ai.generateReflection(context);
    const reflection = await this.prisma.reflection.create({
      data: { planId, content },
    });
    this.logger.log(`Reflection generated: ${planId}`);
    return reflection;
  }
}
