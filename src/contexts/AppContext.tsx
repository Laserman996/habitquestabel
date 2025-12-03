import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Habit, Friend, UserStats } from '@/types/habit';
import { loadState, saveState, generateId, getTitleForLevel } from '@/utils/storage';
import { addXP, XP_PER_COMPLETION, getXPForStreak } from '@/utils/xp';
import { getToday, getCurrentStreak, isHabitDueToday } from '@/utils/dates';
import confetti from 'canvas-confetti';

interface AppContextType {
  state: AppState;
  habits: Habit[];
  userStats: UserStats;
  friends: Friend[];
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

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Save state on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const triggerLevelUpCelebration = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'],
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

      if (leveledUp && xpChange > 0) {
        setTimeout(triggerLevelUpCelebration, 100);
      }

      return {
        ...prev,
        habits: prev.habits.map(h => h.id === id ? updatedHabit : h),
        userStats: newStats,
      };
    });
  }, [triggerLevelUpCelebration]);

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

      if (leveledUp && xpChange > 0) {
        setTimeout(triggerLevelUpCelebration, 100);
      }

      return {
        ...prev,
        habits: prev.habits.map(h => h.id === id ? updatedHabit : h),
        userStats: newStats,
      };
    });
  }, [triggerLevelUpCelebration]);

  const addFriend = useCallback((name: string, xp: number, level: number) => {
    const newFriend: Friend = {
      id: generateId(),
      name,
      xp,
      level,
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

  const getHabitById = useCallback((id: string) => {
    return state.habits.find(h => h.id === id);
  }, [state.habits]);

  return (
    <AppContext.Provider value={{
      state,
      habits: state.habits,
      userStats: state.userStats,
      friends: state.friends,
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
    }}>
      {children}
    </AppContext.Provider>
  );
};
