export const adaptChallengesPrompt = (context: string) => `
Adapt only the incomplete challenges for this new constraint:
${context}

Completed challenges must not be changed. Keep each provided incomplete id exactly once. Return JSON only as {"challenges":[...]} using the same challenge fields and enum values supplied by the application. Keep activities realistic, safe, accessible, and within the constraint.
`;
