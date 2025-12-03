import { Habit } from '@/types/habit';

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDayOfWeek = (dateString: string): number => {
  return new Date(dateString).getDay();
};

export const isHabitDueToday = (habit: Habit): boolean => {
  if (habit.frequency === 'daily') return true;
  const today = getDayOfWeek(getToday());
  return habit.specificDays.includes(today);
};

export const isHabitDueOnDate = (habit: Habit, dateString: string): boolean => {
  if (habit.frequency === 'daily') return true;
  const dayOfWeek = getDayOfWeek(dateString);
  return habit.specificDays.includes(dayOfWeek);
};

export const getCompletionForDate = (habit: Habit, dateString: string): number => {
  return habit.completions[dateString] || 0;
};

export const isCompletedForDate = (habit: Habit, dateString: string): boolean => {
  const completions = getCompletionForDate(habit, dateString);
  return completions >= habit.goalPerDay;
};

export const getCurrentStreak = (habit: Habit): number => {
  let streak = 0;
  let date = new Date();
  
  // Start from yesterday if today isn't completed yet
  const today = getToday();
  if (!isCompletedForDate(habit, today) && isHabitDueToday(habit)) {
    date.setDate(date.getDate() - 1);
  }

  while (true) {
    const dateString = date.toISOString().split('T')[0];
    
    // Don't count days before habit was created
    if (dateString < habit.createdAt.split('T')[0]) break;
    
    if (isHabitDueOnDate(habit, dateString)) {
      if (isCompletedForDate(habit, dateString)) {
        streak++;
      } else {
        break;
      }
    }
    
    date.setDate(date.getDate() - 1);
    
    // Safety limit
    if (streak > 1000) break;
  }

  // Add today if completed
  if (isCompletedForDate(habit, today)) {
    streak = Math.max(streak, 1);
    // Recalculate including today
    let tempStreak = 0;
    let tempDate = new Date();
    while (true) {
      const dateString = tempDate.toISOString().split('T')[0];
      if (dateString < habit.createdAt.split('T')[0]) break;
      if (isHabitDueOnDate(habit, dateString)) {
        if (isCompletedForDate(habit, dateString)) {
          tempStreak++;
        } else {
          break;
        }
      }
      tempDate.setDate(tempDate.getDate() - 1);
      if (tempStreak > 1000) break;
    }
    streak = tempStreak;
  }

  return streak;
};

export const getLongestStreak = (habit: Habit): number => {
  const dates = Object.keys(habit.completions).sort();
  if (dates.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const dateString of dates) {
    if (!isHabitDueOnDate(habit, dateString)) continue;
    if (!isCompletedForDate(habit, dateString)) continue;

    const date = new Date(dateString);
    
    if (lastDate) {
      // Count due days between lastDate and date
      let dueDaysBetween = 0;
      let checkDate = new Date(lastDate);
      checkDate.setDate(checkDate.getDate() + 1);
      
      while (checkDate < date) {
        if (isHabitDueOnDate(habit, checkDate.toISOString().split('T')[0])) {
          dueDaysBetween++;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (dueDaysBetween === 0) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    lastDate = date;
  }

  return longestStreak;
};

export const getWeeklyProgress = (habit: Habit): number => {
  const today = new Date();
  let totalDue = 0;
  let totalCompleted = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    if (dateString < habit.createdAt.split('T')[0]) continue;

    if (isHabitDueOnDate(habit, dateString)) {
      totalDue++;
      if (isCompletedForDate(habit, dateString)) {
        totalCompleted++;
      }
    }
  }

  return totalDue === 0 ? 0 : Math.round((totalCompleted / totalDue) * 100);
};

export const getMonthlyProgress = (habit: Habit): number => {
  const today = new Date();
  let totalDue = 0;
  let totalCompleted = 0;

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    if (dateString < habit.createdAt.split('T')[0]) continue;

    if (isHabitDueOnDate(habit, dateString)) {
      totalDue++;
      if (isCompletedForDate(habit, dateString)) {
        totalCompleted++;
      }
    }
  }

  return totalDue === 0 ? 0 : Math.round((totalCompleted / totalDue) * 100);
};

export const getLast60Days = (): string[] => {
  const days: string[] = [];
  for (let i = 59; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

export const getXPEarnedToday = (habit: Habit): number => {
  const today = getToday();
  const completions = getCompletionForDate(habit, today);
  return completions * 10;
};

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
