import { Challenge, Plan } from '@prisma/client';

export function progressFor(challenges: Challenge[]) {
    const completed = challenges.filter(
        (challenge) => challenge.completed,
    ).length;
    const categoryTotals = new Map<
        Challenge['category'],
        { completed: number; total: number }
    >();
    for (const challenge of challenges) {
        const current = categoryTotals.get(challenge.category) ?? {
            completed: 0,
            total: 0,
        };
        current.total += 1;
        if (challenge.completed) current.completed += 1;
        categoryTotals.set(challenge.category, current);
    }
    return {
        completed,
        total: challenges.length,
        percentage:
            challenges.length === 0
                ? 0
                : Math.round((completed / challenges.length) * 100),
        categories: [...categoryTotals].map(([name, values]) => ({
            name,
            ...values,
        })),
    };
}

export function currentWeekFor(plan: Plan, now = new Date()): number {
    const maxWeek = Math.max(
        1,
        ...((plan as Plan & { challenges?: Challenge[] }).challenges ?? []).map(
            (challenge) => challenge.weekNumber,
        ),
    );
    return Math.min(maxWeek, Math.max(1, Math.ceil(now.getDate() / 7)));
}
