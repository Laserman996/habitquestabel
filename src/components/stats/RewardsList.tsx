import { motion } from 'framer-motion';
import { Lock, Check, Award, Palette, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { REWARDS } from '@/types/habit';
import { cn } from '@/lib/utils';

export const RewardsList = () => {
  const { userStats } = useApp();

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'badge': return Award;
      case 'theme': return Palette;
      case 'animation': return Sparkles;
      default: return Award;
    }
  };

  return (
    <motion.div 
      className="p-6 rounded-2xl bg-card border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Rewards</h2>
      
      <div className="grid gap-3">
        {REWARDS.map((reward, index) => {
          const isUnlocked = userStats.unlockedRewards.includes(reward.name);
          const Icon = getRewardIcon(reward.type);
          
          return (
            <motion.div
              key={reward.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                isUnlocked 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-secondary/50 border-border opacity-60"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                isUnlocked ? "bg-primary/20" : "bg-muted"
              )}>
                {isUnlocked ? (
                  <Icon className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-semibold",
                    isUnlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {reward.name}
                  </span>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>

              <div className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium",
                isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                Lvl {reward.level}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
