import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Flame, Zap, ChevronRight, Target } from 'lucide-react';
import { Habit, CATEGORIES } from '@/types/habit';
import { useApp } from '@/contexts/AppContext';
import { 
  getCurrentStreak, 
  getLongestStreak, 
  getWeeklyProgress, 
  isHabitDueToday,
  isCompletedForDate,
  getToday,
  getCompletionForDate,
  getXPEarnedToday
} from '@/utils/dates';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface HabitCardProps {
  habit: Habit;
  index: number;
}

export const HabitCard = ({ habit, index }: HabitCardProps) => {
  const { toggleHabitCompletion, trackCompletionSpeed } = useApp();
  
  const today = getToday();
  const isDueToday = isHabitDueToday(habit);
  const isCompleted = isCompletedForDate(habit, today);
  const currentStreak = getCurrentStreak(habit);
  const longestStreak = getLongestStreak(habit);
  const weeklyProgress = getWeeklyProgress(habit);
  const todayCompletions = getCompletionForDate(habit, today);
  const xpToday = getXPEarnedToday(habit);
  
  const category = CATEGORIES.find(c => c.value === habit.category);
  
  const categoryColorClass = `bg-category-${habit.category}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "group relative rounded-2xl bg-card border border-border overflow-hidden",
        "hover:shadow-medium transition-all duration-300",
        isCompleted && "ring-2 ring-success/50"
      )}
    >
      {/* Category accent stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", categoryColorClass)} />
      
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{category?.icon}</span>
              <h3 className="font-semibold text-lg truncate">{habit.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{habit.description}</p>
          </div>
          
          {/* Completion Toggle */}
          {isDueToday && (
            <motion.button
              onClick={() => {
                toggleHabitCompletion(habit.id);
                trackCompletionSpeed();
              }}
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                isCompleted 
                  ? "bg-success text-success-foreground glow-primary" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="animate-check"
                >
                  <Check className="w-6 h-6" strokeWidth={3} />
                </motion.div>
              ) : (
                <div className="text-muted-foreground">
                  <Target className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          )}
        </div>

        {/* Progress for multi-goal habits */}
        {habit.goalPerDay > 1 && isDueToday && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-medium">{todayCompletions}/{habit.goalPerDay}</span>
            </div>
            <Progress 
              value={(todayCompletions / habit.goalPerDay) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-streak/10 text-streak">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-semibold">{currentStreak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary">
            <span className="text-xs text-muted-foreground">Best:</span>
            <span className="text-sm font-semibold">{longestStreak}</span>
          </div>
          {xpToday > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-xp/10 text-xp">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">+{xpToday}</span>
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium">{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-1.5" />
        </div>

        {/* View Details Link */}
        <Link to={`/habit/${habit.id}`}>
          <motion.div
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            whileHover={{ x: 4 }}
          >
            <span className="text-sm font-medium">View Details</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </Link>
      </div>

      {/* Not due today indicator */}
      {!isDueToday && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
          <span className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-muted-foreground">
            Not scheduled today
          </span>
        </div>
      )}
    </motion.div>
  );
};
