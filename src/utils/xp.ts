import { UserStats, REWARDS } from '@/types/habit';
import { getTitleForLevel } from './storage';

export const XP_PER_COMPLETION = 10;
export const XP_PER_LEVEL = 100;

export const STREAK_BONUSES: { days: number; xp: number }[] = [
  { days: 7, xp: 50 },
  { days: 30, xp: 200 },
  { days: 60, xp: 400 },
  { days: 100, xp: 1000 },
];

export const calculateLevel = (totalXP: number): { level: number; currentLevelXP: number } => {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const currentLevelXP = totalXP % XP_PER_LEVEL;
  return { level, currentLevelXP };
};

export const addXP = (currentStats: UserStats, xpToAdd: number): { newStats: UserStats; leveledUp: boolean; newRewards: string[] } => {
  const newTotalXP = currentStats.totalXP + xpToAdd;
  const { level, currentLevelXP } = calculateLevel(newTotalXP);
  const leveledUp = level > currentStats.level;
  
  // Check for new rewards
  const newRewards: string[] = [];
  REWARDS.forEach(reward => {
    if (level >= reward.level && !currentStats.unlockedRewards.includes(reward.name)) {
      newRewards.push(reward.name);
    }
  });

  const newStats: UserStats = {
    totalXP: newTotalXP,
    level,
    currentLevelXP,
    unlockedRewards: [...currentStats.unlockedRewards, ...newRewards],
    title: getTitleForLevel(level),
    displayName: currentStats.displayName,
  };

  return { newStats, leveledUp, newRewards };
};

export const getXPForStreak = (streak: number): number => {
  let bonusXP = 0;
  STREAK_BONUSES.forEach(bonus => {
    if (streak === bonus.days) {
      bonusXP += bonus.xp;
    }
  });
  return bonusXP;
};

export const getNextStreakBonus = (currentStreak: number): { days: number; xp: number } | null => {
  return STREAK_BONUSES.find(bonus => bonus.days > currentStreak) || null;
};
