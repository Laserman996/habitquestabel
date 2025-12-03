import { motion } from 'framer-motion';
import { Zap, Star, Trophy, Gift } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { XP_PER_LEVEL, getNextStreakBonus } from '@/utils/xp';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  compact?: boolean;
}

export const LevelProgress = ({ compact }: LevelProgressProps) => {
  const { userStats, habits } = useApp();
  
  const progressPercent = (userStats.currentLevelXP / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - userStats.currentLevelXP;
  
  // Get next streak bonus across all habits
  const habitStreaks = habits.map(h => {
    const streak = Object.keys(h.completions).length; // Simplified
    return streak;
  });
  const maxStreak = Math.max(...habitStreaks, 0);
  const nextBonus = getNextStreakBonus(maxStreak);

  if (compact) {
    return (
      <motion.div 
        className="p-4 rounded-2xl bg-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-level/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-level" />
            </div>
            <div>
              <div className="font-bold text-level">Level {userStats.level}</div>
              <div className="text-xs text-muted-foreground">{userStats.title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xp">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{userStats.totalXP}</span>
            </div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {xpToNextLevel} XP to Level {userStats.level + 1}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-6 rounded-2xl bg-card border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Your Progress</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-xp/10 text-xp">
          <Trophy className="w-4 h-4" />
          <span className="font-bold">{userStats.unlockedRewards.length} Rewards</span>
        </div>
      </div>

      {/* Level Display */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-level to-accent flex items-center justify-center glow-accent"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.3)',
              '0 0 30px rgba(139, 92, 246, 0.5)',
              '0 0 20px rgba(139, 92, 246, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-3xl font-bold text-level-foreground">{userStats.level}</span>
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">{userStats.title}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-xp" />
            <span className="text-2xl font-bold text-xp">{userStats.totalXP}</span>
            <span className="text-muted-foreground">Total XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Level Progress</span>
          <span className="font-medium">{userStats.currentLevelXP} / {XP_PER_LEVEL} XP</span>
        </div>
        <div className="relative">
          <Progress value={progressPercent} className="h-3" />
          <motion.div 
            className="absolute top-0 h-3 bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 rounded-full"
            style={{ width: '30%' }}
            animate={{ left: ['-30%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          {xpToNextLevel} XP until Level {userStats.level + 1}
        </div>
      </div>

      {/* Next Reward */}
      {nextBonus && (
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-xp" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Next Streak Bonus</div>
              <div className="text-sm text-muted-foreground">
                Reach a {nextBonus.days}-day streak for +{nextBonus.xp} XP
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
