export const maxChildAge = 16;

export const presentPoints = 10;
export const streakStep = 2;
export const streakCap = 10;
export const streakBadgeAt = 3;
export const levelWindow = 4;
export const followUpAfter = 3;

export type Level = { name: string; emoji: string; min: number };

export const levels: Level[] = [
  { name: "Champion", emoji: "🏆", min: 70 },
  { name: "Star", emoji: "⭐", min: 50 },
  { name: "Regular", emoji: "🌱", min: 20 },
  { name: "Starter", emoji: "🐣", min: 0 },
];
