export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function getSeason(month: number): Season {
  if (month === 12 || month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'autumn';
}

export function getCurrentPeriod(date = new Date()) {
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    season: getSeason(date.getMonth() + 1),
  };
}
