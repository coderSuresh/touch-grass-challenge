export type ChallengeCategory = "Nature" | "Explore" | "Active" | "Slow down";

export type ChallengeDifficulty = "Gentle" | "Moderate" | "A little ambitious";

export type UserPreferences = {
  location: string;
  interests: string[];
  frequency: string;
  time: string;
  motivations: string[];
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  estimatedTime: string;
  difficulty: ChallengeDifficulty;
  week: number;
  completed: boolean;
  note?: string;
};

export type PlanProgress = {
  completed: number;
  total: number;
  percentage: number;
  categories: Array<{ name: string; completed: number; total: number }>;
};

export type Plan = {
  id: string;
  month: string;
  year: number;
  season: string;
  currentWeek: number;
  title: string;
  challenges: Challenge[];
  progress: PlanProgress;
};

export type Reflection = {
  id?: string;
  planId: string;
  body: string;
  prompt: string;
};
