import { useEffect, useRef } from 'react';
import { Habit, UserStats } from '@/types/habit';
import { getCurrentStreak } from '@/utils/dates';
import { toast } from 'sonner';

interface UseStreakCheckProps {
  habits: Habit[];
  userStats: UserStats;
  onStreakReset?: () => void;
}

export const useStreakCheck = ({ habits, userStats, onStreakReset }: UseStreakCheckProps) => {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastCheck = userStats.lastStreakCheck;

    // Only show message if this is a new day and user had streaks before
    if (lastCheck && lastCheck !== today) {
      const habitsWithBrokenStreaks = habits.filter(habit => {
        // Check if habit had a streak yesterday but doesn't have one today
        const currentStreak = getCurrentStreak(habit);
        const hadCompletionsBeforeToday = Object.keys(habit.completions).some(
          date => date < today
        );
        return hadCompletionsBeforeToday && currentStreak === 0;
      });

      if (habitsWithBrokenStreaks.length > 0) {
        setTimeout(() => {
          toast.info("New day, new start! 🌅", {
            description: "Let's rebuild your streak. Every day is a fresh opportunity!",
            duration: 5000,
          });
        }, 1000);
        onStreakReset?.();
      }
    }

    hasChecked.current = true;
  }, [habits, userStats.lastStreakCheck, onStreakReset]);
};
