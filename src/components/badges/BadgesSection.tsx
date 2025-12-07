import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { STREAK_BADGES } from '@/types/habit';
import { cn } from '@/lib/utils';

interface BadgesSectionProps {
  unlockedBadges: string[];
  compact?: boolean;
}

export const BadgesSection = ({ unlockedBadges, compact = false }: BadgesSectionProps) => {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {STREAK_BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                isUnlocked 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-muted/50 border-border opacity-50"
              )}
              whileHover={{ scale: 1.05 }}
              title={isUnlocked ? badge.description : `Unlock: ${badge.streak}-day streak`}
            >
              <span className="text-lg">{isUnlocked ? badge.icon : '🔒'}</span>
              <span className={cn(
                "text-sm font-medium",
                !isUnlocked && "text-muted-foreground"
              )}>
                {badge.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 rounded-2xl bg-card border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
          <Award className="w-5 h-5 text-xp" />
        </div>
        <div>
          <h2 className="font-semibold">Streak Badges</h2>
          <p className="text-sm text-muted-foreground">
            {unlockedBadges.length} / {STREAK_BADGES.length} unlocked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STREAK_BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              className={cn(
                "relative p-4 rounded-xl border text-center transition-all",
                isUnlocked 
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30" 
                  : "bg-muted/30 border-border"
              )}
              whileHover={{ scale: 1.02 }}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl backdrop-blur-sm">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h3 className={cn(
                "font-semibold text-sm",
                !isUnlocked && "text-muted-foreground"
              )}>
                {badge.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isUnlocked ? badge.description : `${badge.streak}-day streak`}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
