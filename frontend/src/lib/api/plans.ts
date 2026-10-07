import { apiRequest } from "./client";
import type { Plan, UserPreferences } from "../types";

type ApiPlan = Omit<Plan, "month" | "challenges"> & {
  month: number;
  challenges: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedMinutes: number;
    difficulty: string;
    weekNumber: number;
    completed: boolean;
    note?: string | null;
  }>;
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function displayCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function displayDifficulty(difficulty: string) {
  return { EASY: "Gentle", MODERATE: "Moderate", ADVENTUROUS: "A little ambitious" }[difficulty] ?? difficulty;
}

export function normalizePlan(value: ApiPlan): Plan {
  return {
    ...value,
    month: monthNames[value.month - 1] ?? String(value.month),
    challenges: value.challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: displayCategory(challenge.category) as Plan["challenges"][number]["category"],
      estimatedTime: `${challenge.estimatedMinutes} min`,
      difficulty: displayDifficulty(challenge.difficulty) as Plan["challenges"][number]["difficulty"],
      week: challenge.weekNumber,
      completed: challenge.completed,
      note: challenge.note ?? undefined,
    })),
  };
}

export async function generatePlan(
  preferences: UserPreferences,
): Promise<Plan> {
  const response = await apiRequest<ApiPlan>("/plans", {
    method: "POST",
    body: JSON.stringify({ ...preferences, timePerDay: preferences.time }),
  });
  return normalizePlan(response);
}

export async function getCurrentPlan(planId: string): Promise<Plan> {
  const response = await apiRequest<ApiPlan>(`/plans/current?planId=${encodeURIComponent(planId)}`);
  return normalizePlan(response);
}

export async function createNextPlan(planId: string, mode: string): Promise<Plan> {
  const response = await apiRequest<ApiPlan>(`/plans/${planId}/next`, {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
  return normalizePlan(response);
}

export async function adaptPlan(planId: string, constraint: string): Promise<Plan> {
  const response = await apiRequest<ApiPlan>(`/plans/${planId}/adapt`, {
    method: "POST",
    body: JSON.stringify({ constraint }),
  });
  return normalizePlan(response);
}
