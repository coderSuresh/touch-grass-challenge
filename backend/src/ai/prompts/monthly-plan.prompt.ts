export const monthlyPlanPrompt = (context: string) => `
Create a realistic monthly outdoor challenge plan from this context:
${context}

Respect the available time, interests, motivation, location, and season. Prefer accessible activities, avoid danger and expensive equipment, and do not invent specific businesses or events. Make experiences genuinely different. Return JSON only, with exactly this shape:
{"title":"string","target":12,"challenges":[{"title":"string","description":"string","category":"NATURE|WALKING|EXPLORATION|PHOTOGRAPHY|RUNNING|CULTURE|WILDLIFE|FOOD|WELLNESS|OTHER","estimatedMinutes":30,"difficulty":"EASY|MODERATE|ADVENTUROUS","weekNumber":1}]}
`;
