export type Category = 
  | 'health' 
  | 'fitness' 
  | 'learning' 
  | 'mindfulness' 
  | 'productivity' 
  | 'social' 
  | 'other';

export type Frequency = 'daily' | 'specific';

export interface HabitReminder {
  enabled: boolean;
  time: string; // HH:MM format
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: Category;
  color: string;
  frequency: Frequency;
  specificDays: number[]; // 0 = Sunday, 6 = Saturday
  goalPerDay: number;
  createdAt: string;
  completions: Record<string, number>; // date string -> completion count
  xpEarned: number;
  reminder?: HabitReminder;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  unlockedRewards: string[];
  title: string;
  displayName: string;
  badges: string[];
  lastStreakCheck: string;
}

export interface Friend {
  id: string;
  name: string;
  xp: number;
  level: number;
  badges?: string[];
  streak?: number;
}

export interface Challenge {
  id: string;
  type: 'weekly' | 'monthly';
  name: string;
  description: string;
  target: number;
  progress: number;
  reward: number; // XP reward
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface AppState {
  habits: Habit[];
  userStats: UserStats;
  friends: Friend[];
  theme: 'light' | 'dark';
  lastVisit: string;
  challenges: Challenge[];
}

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'health', label: 'Health', icon: '💚' },
  { value: 'fitness', label: 'Fitness', icon: '🏃' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
  { value: 'productivity', label: 'Productivity', icon: '⚡' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export const HABIT_COLORS = [
  { name: 'Emerald', value: 'emerald', class: 'bg-primary' },
  { name: 'Orange', value: 'orange', class: 'bg-streak' },
  { name: 'Blue', value: 'blue', class: 'bg-category-learning' },
  { name: 'Purple', value: 'purple', class: 'bg-accent' },
  { name: 'Gold', value: 'gold', class: 'bg-xp' },
  { name: 'Pink', value: 'pink', class: 'bg-category-social' },
];

export const TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 0, title: 'Beginner' },
  { minLevel: 5, title: 'Habit Builder' },
  { minLevel: 10, title: 'Streak Master' },
  { minLevel: 20, title: 'Discipline Pro' },
  { minLevel: 30, title: 'Consistency King' },
  { minLevel: 50, title: 'Habit Legend' },
  { minLevel: 100, title: 'Legendary Champion' },
];

export const REWARDS: { level: number; type: string; name: string; description: string }[] = [
  { level: 1, type: 'badge', name: 'First Steps', description: 'Started your habit journey!' },
  { level: 3, type: 'theme', name: 'Ocean Theme', description: 'Unlocked cool blue accents' },
  { level: 5, type: 'badge', name: 'Streak Master', description: 'Reached Level 5!' },
  { level: 7, type: 'animation', name: 'Sparkle Effect', description: 'Cards now sparkle on hover' },
  { level: 10, type: 'badge', name: 'Level 10 Pro', description: 'You\'re getting serious!' },
  { level: 15, type: 'theme', name: 'Sunset Theme', description: 'Warm orange gradients' },
  { level: 20, type: 'badge', name: 'Discipline Pro', description: 'Incredible dedication!' },
  { level: 25, type: 'animation', name: 'Glow Effect', description: 'Enhanced glow animations' },
  { level: 30, type: 'badge', name: 'Consistency King', description: 'Royalty status achieved!' },
  { level: 50, type: 'badge', name: 'Habit Legend', description: 'Legendary status!' },
];

// Streak-based badges
export const STREAK_BADGES: { streak: number; id: string; name: string; description: string; icon: string }[] = [
  { streak: 3, id: 'starter', name: 'Starter', description: '3-day streak achieved!', icon: '🌱' },
  { streak: 7, id: 'committed', name: 'Committed', description: '7-day streak achieved!', icon: '🔥' },
  { streak: 14, id: 'focused', name: 'Focused', description: '14-day streak achieved!', icon: '🎯' },
  { streak: 30, id: 'unbreakable', name: 'Unbreakable', description: '30-day streak achieved!', icon: '💎' },
  { streak: 60, id: 'legendary', name: 'Legendary', description: '60-day streak achieved!', icon: '👑' },
  { streak: 100, id: 'immortal', name: 'Immortal', description: '100-day streak achieved!', icon: '⭐' },
];

// Challenge templates
export const CHALLENGE_TEMPLATES = {
  weekly: [
    { name: 'Weekly Warrior', description: 'Complete habits 5 times this week', target: 5, reward: 100 },
    { name: 'Consistency Check', description: 'Complete all due habits for 3 days', target: 3, reward: 75 },
    { name: 'Habit Hunter', description: 'Complete 10 habit check-ins', target: 10, reward: 120 },
  ],
  monthly: [
    { name: 'Monthly Master', description: 'Maintain a 20-day streak', target: 20, reward: 500 },
    { name: 'XP Collector', description: 'Earn 500 XP this month', target: 500, reward: 300 },
    { name: 'Perfect Month', description: 'Complete all habits for 25 days', target: 25, reward: 750 },
  ],
};
