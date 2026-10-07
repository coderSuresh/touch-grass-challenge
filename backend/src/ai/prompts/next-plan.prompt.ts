export const nextPlanPrompt = (context: string) => `
Create a fresh outdoor plan following the previous plan. Context:
${context}

Respect the selected mode, current season, and preferences. Use variety, safe accessible activities, and no invented businesses/events. Return JSON only using the requested generated-plan shape.
`;
