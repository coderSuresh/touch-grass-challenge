import 'dotenv/config';
import { PrismaClient, ChallengeCategory, Difficulty } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const plan = await prisma.plan.create({
    data: {
      periodType: 'MONTH', month: 10, year: 2026, season: 'autumn',
      title: 'Your October Outside', location: 'Biratnagar, Nepal',
      preferences: { location: 'Biratnagar, Nepal', interests: ['nature', 'walking'], frequency: '3-4_days', timePerDay: '30-60_minutes', motivations: ['notice_nature'] },
      target: 4,
      challenges: {
        create: [
          { title: 'Take a different route home', description: 'Choose one turn you normally pass by and see where it leads.', category: ChallengeCategory.EXPLORATION, estimatedMinutes: 30, difficulty: Difficulty.EASY, weekNumber: 1, completed: true, completedAt: new Date(), note: 'Found a quiet lane.' },
          { title: 'Find five signs of the season', description: 'Look closely for five small changes that tell you what time of year it is.', category: ChallengeCategory.NATURE, estimatedMinutes: 30, difficulty: Difficulty.EASY, weekNumber: 1 },
          { title: 'Walk a new loop', description: 'Make a small circle through your neighborhood without taking the shortest route.', category: ChallengeCategory.WALKING, estimatedMinutes: 45, difficulty: Difficulty.MODERATE, weekNumber: 2 },
          { title: 'Photograph small details', description: 'Take a walk and notice textures, colors, and shadows you normally miss.', category: ChallengeCategory.PHOTOGRAPHY, estimatedMinutes: 30, difficulty: Difficulty.EASY, weekNumber: 3 },
        ]
      },
    },
  });
  console.log(`Seeded plan ${plan.id}`);
}

main().finally(() => prisma.$disconnect());