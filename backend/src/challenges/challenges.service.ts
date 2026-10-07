import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { progressFor } from '../common/plan-response.util';
import { currentWeekFor } from '../common/plan-response.util';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteChallengeDto } from './dto/complete-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found.');
    return challenge;
  }

  async complete(id: string, dto: CompleteChallengeDto) {
    const challenge = await this.getById(id);

    if (challenge.completed)
      throw new ConflictException('Challenge is already completed.');

    const plan = await this.prisma.plan.findUnique({
      where: { id: challenge.planId },
      include: { challenges: true },
    });
    if (plan && challenge.weekNumber > currentWeekFor(plan)) {
      throw new ConflictException(
        `Challenge is not available until week ${challenge.weekNumber}.`,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.challenge.update({
        where: { id },
        data: {
          completed: true,
          completedAt: new Date(),
          note: dto.note ?? null,
        },
      });

      const challenges = await tx.challenge.findMany({
        where: { planId: challenge.planId },
      });

      const completed = challenges.filter((item) => item.completed).length;

      if (challenges.length > 0 && completed === challenges.length) {
        await tx.plan.update({
          where: { id: challenge.planId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      }
      return {
        result,
        progress: progressFor(
          challenges.map((item) => (item.id === id ? result : item)),
        ),
      };
    });
    this.logger.log(`Challenge completed: ${id}`);
    return { ...updated.result, progress: updated.progress };
  }

  async updateNote(id: string, dto: UpdateChallengeDto) {
    await this.getById(id);
    return this.prisma.challenge.update({
      where: { id },
      data: { note: dto.note ?? null },
    });
  }
}
