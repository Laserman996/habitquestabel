import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Habit, Friend, UserStats, Challenge, STREAK_BADGES, HabitReminder } from '@/types/habit';
import { loadState, saveState, generateId, getTitleForLevel } from '@/utils/storage';
import { addXP, XP_PER_COMPLETION, getXPForStreak } from '@/utils/xp';
import { getToday, getCurrentStreak, isHabitDueToday } from '@/utils/dates';
import { useCompletionSpeedWarning } from '@/hooks/useCompletionSpeedWarning';
import { useStreakCheck } from '@/hooks/useStreakCheck';
import { useNotifications } from '@/hooks/useNotifications';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface AppContextType {
  state: AppState;
  habits: Habit[];
  userStats: UserStats;
  friends: Friend[];
  challenges: Challenge[];
  theme: 'light' | 'dark';
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'xpEarned'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  togglePastDay: (id: string, dateString: string) => void;
  addFriend: (name: string, xp: number, level: number) => void;
  updateFriend: (friend: Friend) => void;
  deleteFriend: (id: string) => void;
  toggleTheme: () => void;
  getHabitById: (id: string) => Habit | undefined;
  updateDisplayName: (name: string) => void;
  trackCompletionSpeed: () => void;
  updateHabitReminder: (habitId: string, reminder: HabitReminder) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadState);
  const { trackCompletion } = useCompletionSpeedWarning();
  const { scheduleReminder } = useNotifications();

  // Streak check hook
  useStreakCheck({
    habits: state.habits,
    userStats: state.userStats,
    onStreakReset: () => {
      setState(prev => ({
        ...prev,
        userStats: {
          ...prev.userStats,
          lastStreakCheck: getToday(),
        },
      }));
    },
  });

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Save state on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Schedule reminders on load
  useEffect(() => {
    state.habits.forEach(habit => {
      if (habit.reminder?.enabled) {
        scheduleReminder(habit);
      }
    });
  }, []);

  const triggerLevelUpCelebration = useCallback((newLevel: number) => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'],
    });
    
    toast.success(`🎉 Level Up!`, {
      description: `You've reached Level ${newLevel}! Keep up the amazing work!`,
      duration: 5000,
    });
  }, []);

  const triggerBadgeUnlock = useCallback((badgeName: string, badgeIcon: string) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    });
    
    toast.success(`🏆 New Badge Unlocked!`, {
      description: `${badgeIcon} ${badgeName}`,
      duration: 5000,
    });
  }, []);

  const checkAndAwardBadges = useCallback((habits: Habit[], currentBadges: string[]): string[] => {
    const newBadges: string[] = [];
    
    habits.forEach(habit => {
      const streak = getCurrentStreak(habit);
      
      STREAK_BADGES.forEach(badge => {
        if (streak >= badge.streak && !currentBadges.includes(badge.id) && !newBadges.includes(badge.id)) {
          newBadges.push(badge.id);
          setTimeout(() => {
            triggerBadgeUnlock(badge.name, badge.icon);
          }, 500);
        }
      });
    });
    
    return newBadges;
  }, [triggerBadgeUnlock]);

  const updateChallengeProgress = useCallback((state: AppState): Challenge[] => {
    const today = getToday();
    
    return state.challenges.map(challenge => {
      if (challenge.completed) return challenge;
      
      let progress = 0;
      
      if (challenge.name.includes('complete') || challenge.name.includes('Complete')) {
        // Count habit completions
        progress = state.habits.reduce((sum, habit) => {
          return sum + Object.entries(habit.completions)
            .filter(([date]) => date >= challenge.startDate && date <= today)
            .reduce((total, [, count]) => total + count, 0);
        }, 0);
      } else if (challenge.name.includes('streak') || challenge.name.includes('Streak')) {
        // Get max streak
        progress = Math.max(...state.habits.map(h => getCurrentStreak(h)), 0);
      } else if (challenge.name.includes('XP')) {
        // XP earned in period - simplified
        progress = state.userStats.totalXP;
      } else {
        // Default: count completions
        progress = state.habits.reduce((sum, habit) => {
          return sum + Object.entries(habit.completions)
            .filter(([date]) => date >= challenge.startDate && date <= today)
            .reduce((total, [, count]) => total + (count > 0 ? 1 : 0), 0);
        }, 0);
      }
      
      const completed = progress >= challenge.target;
      
      return { ...challenge, progress: Math.min(progress, challenge.target), completed };
    });
  }, []);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'xpEarned'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completions: {},
      xpEarned: 0,
    };
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  }, []);

  const updateHabit = useCallback((habit: Habit) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habit.id ? habit : h),
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
    }));
  }, []);

  const toggleHabitCompletion = useCallback((id: string) => {
    const today = getToday();
    
    setState(prev => {
      const habit = prev.habits.find(h => h.id === id);
      if (!habit || !isHabitDueToday(habit)) return prev;

      const currentCompletions = habit.completions[today] || 0;
      const isCompleting = currentCompletions < habit.goalPerDay;
      
      let newCompletions: number;
      let xpChange = 0;

      if (isCompleting) {
        newCompletions = currentCompletions + 1;
        xpChange = XP_PER_COMPLETION;
        
        // Check for streak bonuses
        const streakBefore = getCurrentStreak(habit);
        const updatedHabit = {
          ...habit,
          completions: { ...habit.completions, [today]: newCompletions },
        };
        const streakAfter = getCurrentStreak(updatedHabit);
        
        if (streakAfter > streakBefore) {
          xpChange += getXPForStreak(streakAfter);
        }
      } else {
        newCompletions = 0;
        xpChange = -(currentCompletions * XP_PER_COMPLETION);
      }

      const updatedHabit = {
        ...habit,
        completions: { ...habit.completions, [today]: newCompletions },
        xpEarned: habit.xpEarned + xpChange,
      };

      const { newStats, leveledUp } = addXP(prev.userStats, xpChange);
      
      // Check for new badges
      const updatedHabits = prev.habits.map(h => h.id === id ? updatedHabit : h);
      const newBadges = checkAndAwardBadges(updatedHabits, newStats.badges);

      if (leveledUp && xpChange > 0) {
        setTimeout(() => triggerLevelUpCelebration(newStats.level), 100);
      }

      const newState = {
        ...prev,
        habits: updatedHabits,
        userStats: {
          ...newStats,
          badges: [...newStats.badges, ...newBadges],
          lastStreakCheck: today,
        },
      };

      // Update challenge progress
      newState.challenges = updateChallengeProgress(newState);
      
      // Check for completed challenges
      newState.challenges.forEach((challenge, idx) => {
        if (challenge.completed && !prev.challenges[idx]?.completed) {
          const { newStats: statsWithBonus } = addXP(newState.userStats, challenge.reward);
          newState.userStats = {
            ...statsWithBonus,
            badges: newState.userStats.badges,
          };
          toast.success(`🏆 Challenge Complete: ${challenge.name}!`, {
            description: `+${challenge.reward} XP bonus earned!`,
          });
        }
      });

      return newState;
    });
  }, [triggerLevelUpCelebration, checkAndAwardBadges, updateChallengeProgress]);

  const togglePastDay = useCallback((id: string, dateString: string) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === id);
      if (!habit) return prev;

      const currentCompletions = habit.completions[dateString] || 0;
      const isCompleting = currentCompletions < habit.goalPerDay;
      
      const newCompletions = isCompleting ? habit.goalPerDay : 0;
      const xpChange = isCompleting 
        ? (habit.goalPerDay - currentCompletions) * XP_PER_COMPLETION
        : -(currentCompletions * XP_PER_COMPLETION);

      const updatedHabit = {
        ...habit,
        completions: { ...habit.completions, [dateString]: newCompletions },
        xpEarned: habit.xpEarned + xpChange,
      };

      const { newStats, leveledUp } = addXP(prev.userStats, xpChange);
      
      // Check for new badges
      const updatedHabits = prev.habits.map(h => h.id === id ? updatedHabit : h);
      const newBadges = checkAndAwardBadges(updatedHabits, newStats.badges);

      if (leveledUp && xpChange > 0) {
        setTimeout(() => triggerLevelUpCelebration(newStats.level), 100);
      }

      return {
        ...prev,
        habits: updatedHabits,
        userStats: {
          ...newStats,
          badges: [...newStats.badges, ...newBadges],
        },
      };
    });
  }, [triggerLevelUpCelebration, checkAndAwardBadges]);

  const addFriend = useCallback((name: string, xp: number, level: number) => {
    const newFriend: Friend = {
      id: generateId(),
      name,
      xp,
      level,
      badges: [],
      streak: 0,
    };
    setState(prev => ({
      ...prev,
      friends: [...prev.friends, newFriend],
    }));
  }, []);

  const updateFriend = useCallback((friend: Friend) => {
    setState(prev => ({
      ...prev,
      friends: prev.friends.map(f => f.id === friend.id ? friend : f),
    }));
  }, []);

  const deleteFriend = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== id),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      userStats: { ...prev.userStats, displayName: name },
    }));
  }, []);

  const updateHabitReminder = useCallback((habitId: string, reminder: HabitReminder) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => 
        h.id === habitId ? { ...h, reminder } : h
      ),
    }));
  }, []);

  const getHabitById = useCallback((id: string) => {
    return state.habits.find(h => h.id === id);
  }, [state.habits]);

  return (
    <AppContext.Provider value={{
      state,
      habits: state.habits,
      userStats: state.userStats,
      friends: state.friends,
      challenges: state.challenges || [],
      theme: state.theme,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitCompletion,
      togglePastDay,
      addFriend,
      updateFriend,
      deleteFriend,
      toggleTheme,
      getHabitById,
      updateDisplayName,
      trackCompletionSpeed: trackCompletion,
      updateHabitReminder,
    }}>
      {children}
    </AppContext.Provider>
  );
};
