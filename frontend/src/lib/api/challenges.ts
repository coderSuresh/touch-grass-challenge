import { apiRequest } from "./client";
import type { Challenge, PlanProgress } from "../types";

type CompletionResponse = {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  difficulty: string;
  weekNumber: number;
  completed: boolean;
  note?: string | null;
  progress: PlanProgress;
};

function normalizeChallenge(value: Omit<CompletionResponse, "progress">) {
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    category: value.category.charAt(0) + value.category.slice(1).toLowerCase(),
    estimatedTime: `${value.estimatedMinutes} min`,
    difficulty: { EASY: "Gentle", MODERATE: "Moderate", ADVENTUROUS: "A little ambitious" }[value.difficulty] ?? value.difficulty,
    week: value.weekNumber,
    completed: value.completed,
    note: value.note ?? undefined,
  };
}

export async function completeChallenge(
  challengeId: string,
  note?: string,
): Promise<{ challenge: Challenge; progress: PlanProgress }> {
  const response = await apiRequest<CompletionResponse>(`/challenges/${challengeId}/complete`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
  return {
    challenge: normalizeChallenge(response) as Challenge,
    progress: response.progress,
  };
}

export async function updateChallengeNote(challengeId: string, note: string) {
  return apiRequest(`/challenges/${challengeId}`, {
    method: "PATCH",
    body: JSON.stringify({ note: note || null }),
  });
}
