import { AppState, Habit, Friend, UserStats, TITLES, Challenge, CHALLENGE_TEMPLATES } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

const generateChallenges = (): Challenge[] => {
  const now = new Date();
  const challenges: Challenge[] = [];
  
  // Weekly challenge
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const weeklyTemplate = CHALLENGE_TEMPLATES.weekly[Math.floor(Math.random() * CHALLENGE_TEMPLATES.weekly.length)];
  challenges.push({
    id: `weekly-${weekStart.toISOString().split('T')[0]}`,
    type: 'weekly',
    name: weeklyTemplate.name,
    description: weeklyTemplate.description,
    target: weeklyTemplate.target,
    progress: 0,
    reward: weeklyTemplate.reward,
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0],
    completed: false,
  });
  
  // Monthly challenge
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthlyTemplate = CHALLENGE_TEMPLATES.monthly[Math.floor(Math.random() * CHALLENGE_TEMPLATES.monthly.length)];
  challenges.push({
    id: `monthly-${monthStart.toISOString().split('T')[0]}`,
    type: 'monthly',
    name: monthlyTemplate.name,
    description: monthlyTemplate.description,
    target: monthlyTemplate.target,
    progress: 0,
    reward: monthlyTemplate.reward,
    startDate: monthStart.toISOString().split('T')[0],
    endDate: monthEnd.toISOString().split('T')[0],
    completed: false,
  });
  
  return challenges;
};

const getDefaultState = (): AppState => ({
  habits: [],
  userStats: {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    unlockedRewards: [],
    title: 'Beginner',
    displayName: '',
    badges: [],
    lastStreakCheck: new Date().toISOString().split('T')[0],
  },
  friends: [],
  theme: 'dark',
  lastVisit: new Date().toISOString().split('T')[0],
  challenges: generateChallenges(),
});

export const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved) as AppState;
      const defaultState = getDefaultState();
      
      // Ensure new fields exist
      if (!state.userStats.badges) {
        state.userStats.badges = [];
      }
      if (!state.challenges) {
        state.challenges = generateChallenges();
      }
      
      // Refresh challenges if expired
      const now = new Date().toISOString().split('T')[0];
      state.challenges = state.challenges.map(challenge => {
        if (challenge.endDate < now) {
          // Generate new challenge of same type
          const templates = CHALLENGE_TEMPLATES[challenge.type];
          const template = templates[Math.floor(Math.random() * templates.length)];
          
          if (challenge.type === 'weekly') {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            return {
              id: `weekly-${weekStart.toISOString().split('T')[0]}`,
              type: 'weekly' as const,
              name: template.name,
              description: template.description,
              target: template.target,
              progress: 0,
              reward: template.reward,
              startDate: weekStart.toISOString().split('T')[0],
              endDate: weekEnd.toISOString().split('T')[0],
              completed: false,
            };
          } else {
            const monthStart = new Date();
            monthStart.setDate(1);
            const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            
            return {
              id: `monthly-${monthStart.toISOString().split('T')[0]}`,
              type: 'monthly' as const,
              name: template.name,
              description: template.description,
              target: template.target,
              progress: 0,
              reward: template.reward,
              startDate: monthStart.toISOString().split('T')[0],
              endDate: monthEnd.toISOString().split('T')[0],
              completed: false,
            };
          }
        }
        return challenge;
      });
      
      return { ...defaultState, ...state };
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
