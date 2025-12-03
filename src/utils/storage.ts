import { AppState, Habit, Friend, UserStats, TITLES } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

const getDefaultState = (): AppState => ({
  habits: [],
  userStats: {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    unlockedRewards: [],
    title: 'Beginner',
    displayName: '',
  },
  friends: [],
  theme: 'dark',
  lastVisit: new Date().toISOString().split('T')[0],
});

export const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved) as AppState;
      return { ...getDefaultState(), ...state };
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  return getDefaultState();
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const saveHabits = (habits: Habit[]): void => {
  const state = loadState();
  state.habits = habits;
  saveState(state);
};

export const saveUserStats = (stats: UserStats): void => {
  const state = loadState();
  state.userStats = stats;
  saveState(state);
};

export const saveFriends = (friends: Friend[]): void => {
  const state = loadState();
  state.friends = friends;
  saveState(state);
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  const state = loadState();
  state.theme = theme;
  saveState(state);
};

export const updateLastVisit = (): void => {
  const state = loadState();
  state.lastVisit = new Date().toISOString().split('T')[0];
  saveState(state);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getTitleForLevel = (level: number): string => {
  const title = [...TITLES].reverse().find(t => level >= t.minLevel);
  return title?.title || 'Beginner';
};
