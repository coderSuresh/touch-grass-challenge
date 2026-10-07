export const reflectionPrompt = (context: string) => `
Write a warm, concise reflection on this completed outdoor plan:
${context}

Use the completed activities and notes as evidence. Do not invent facts. Return plain text only, not Markdown or JSON.
`;
