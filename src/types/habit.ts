export type Category = 
  | 'health' 
  | 'fitness' 
  | 'learning' 
  | 'mindfulness' 
  | 'productivity' 
  | 'social' 
  | 'other';

export type Frequency = 'daily' | 'specific';

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
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  unlockedRewards: string[];
  title: string;
}

export interface Friend {
  id: string;
  name: string;
  xp: number;
  level: number;
}

export interface AppState {
  habits: Habit[];
  userStats: UserStats;
  friends: Friend[];
  theme: 'light' | 'dark';
  lastVisit: string;
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
