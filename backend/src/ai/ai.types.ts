import { ChallengeCategory, Difficulty } from '@prisma/client';

export interface PlanGenerationContext {
  location: string;
  interests: string[];
  frequency: string;
  timePerDay: string;
  motivations: string[];
  month: number;
  year: number;
  season: string;
}

export interface GeneratedChallenge {
  title: string;
  description: string;
  category: ChallengeCategory;
  estimatedMinutes: number;
  difficulty: Difficulty;
  weekNumber: number;
}

export interface GeneratedPlan {
  title: string;
  target: number;
  challenges: GeneratedChallenge[];
}

export interface AdaptationContext {
  preferences: PlanGenerationContext;
  incomplete: Array<GeneratedChallenge & { id: string }>;
  completed: Array<GeneratedChallenge & { id: string; note: string | null }>;
  constraint: string;
}

export interface AdaptedChallenges {
  challenges: Array<GeneratedChallenge & { id: string }>;
}

export interface ReflectionContext {
  preferences: PlanGenerationContext;
  challenges: Array<
    GeneratedChallenge & { id: string; completed: boolean; note: string | null }
  >;
}

export interface AIProvider {
  generatePlan(context: PlanGenerationContext): Promise<GeneratedPlan>;
  adaptChallenges(context: AdaptationContext): Promise<AdaptedChallenges>;
  generateReflection(context: ReflectionContext): Promise<string>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
