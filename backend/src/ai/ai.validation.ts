import { BadGatewayException } from '@nestjs/common';
import { ChallengeCategory, Difficulty } from '@prisma/client';
import {
  AdaptedChallenges,
  GeneratedChallenge,
  GeneratedPlan,
} from './ai.types';

const categories = new Set(Object.values(ChallengeCategory));
const difficulties = new Set(Object.values(Difficulty));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateChallenge(
  value: unknown,
  includeId = false,
): GeneratedChallenge & { id?: string } {
  if (!isRecord(value))
    throw new BadGatewayException('AI returned an invalid challenge.');
  const requiredStrings = ['title', 'description'];
  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string' || value[field].trim().length === 0) {
      throw new BadGatewayException('AI returned an invalid challenge.');
    }
  }
  if (includeId && (typeof value.id !== 'string' || value.id.length === 0)) {
    throw new BadGatewayException('AI returned an invalid challenge id.');
  }
  if (
    !categories.has(value.category as ChallengeCategory) ||
    !difficulties.has(value.difficulty as Difficulty)
  ) {
    throw new BadGatewayException('AI returned an invalid challenge enum.');
  }
  if (
    typeof value.estimatedMinutes !== 'number' ||
    !Number.isInteger(value.estimatedMinutes) ||
    value.estimatedMinutes < 5 ||
    value.estimatedMinutes > 1440
  ) {
    throw new BadGatewayException('AI returned an invalid duration.');
  }
  if (
    typeof value.weekNumber !== 'number' ||
    !Number.isInteger(value.weekNumber) ||
    value.weekNumber < 1 ||
    value.weekNumber > 5
  ) {
    throw new BadGatewayException('AI returned an invalid week number.');
  }
  return value as unknown as GeneratedChallenge & { id?: string };
}

export function validateGeneratedPlan(value: unknown): GeneratedPlan {
  if (
    !isRecord(value) ||
    typeof value.title !== 'string' ||
    value.title.trim() === ''
  ) {
    throw new BadGatewayException('AI returned an invalid plan.');
  }
  if (
    typeof value.target !== 'number' ||
    !Number.isInteger(value.target) ||
    value.target < 1 ||
    value.target > 31
  ) {
    throw new BadGatewayException('AI returned an invalid target.');
  }
  if (
    !Array.isArray(value.challenges) ||
    value.challenges.length !== value.target
  ) {
    throw new BadGatewayException(
      'AI returned a plan with an invalid challenge count.',
    );
  }
  return {
    title: value.title,
    target: value.target,
    challenges: value.challenges.map((challenge) =>
      validateChallenge(challenge),
    ),
  };
}

export function validateAdaptedChallenges(
  value: unknown,
  expectedIds: Set<string>,
): AdaptedChallenges {
  if (
    !isRecord(value) ||
    !Array.isArray(value.challenges) ||
    value.challenges.length !== expectedIds.size
  ) {
    throw new BadGatewayException('AI returned an invalid adaptation.');
  }
  const challenges = value.challenges.map((challenge) =>
    validateChallenge(challenge, true),
  );
  const ids = new Set(challenges.map((challenge) => challenge.id));
  if (
    ids.size !== expectedIds.size ||
    [...expectedIds].some((id) => !ids.has(id))
  ) {
    throw new BadGatewayException(
      'AI returned an adaptation for the wrong challenges.',
    );
  }
  return {
    challenges: challenges as Array<GeneratedChallenge & { id: string }>,
  };
}

export function validateReflection(value: unknown): string {
  if (
    typeof value !== 'string' ||
    value.trim().length < 1 ||
    value.length > 10000
  ) {
    throw new BadGatewayException('AI returned an invalid reflection.');
  }
  return value.trim();
}
