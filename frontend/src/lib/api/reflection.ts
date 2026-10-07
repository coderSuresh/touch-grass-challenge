import { apiRequest } from "./client";
import type { Reflection } from "../types";

export async function generateReflection(planId: string): Promise<Reflection> {
  const response = await apiRequest<{ id: string; planId: string; content: string }>(`/plans/${planId}/reflection`, {
    method: "POST",
  });
  return { id: response.id, planId: response.planId, body: response.content, prompt: "What would you like to carry into next month?" };
}
