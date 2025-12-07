import { motion } from 'framer-motion';
import { Trophy, Calendar, Target, Clock, Sparkles } from 'lucide-react';
import { Challenge } from '@/types/habit';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ChallengesSectionProps {
  challenges: Challenge[];
  compact?: boolean;
}

export const ChallengesSection = ({ challenges, compact = false }: ChallengesSectionProps) => {
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 'Ends today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            className={cn(
              "p-4 rounded-xl border",
              challenge.completed 
                ? "bg-primary/10 border-primary/30" 
                : "bg-card border-border"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              {challenge.type === 'weekly' ? (
                <Calendar className="w-4 h-4 text-primary" />
              ) : (
                <Target className="w-4 h-4 text-accent" />
              )}
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {challenge.type}
              </span>
              {challenge.completed && <Sparkles className="w-4 h-4 text-xp ml-auto" />}
            </div>
            <h4 className="font-semibold text-sm mb-1">{challenge.name}</h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{challenge.progress}/{challenge.target}</span>
              <span>+{challenge.reward} XP</span>
            </div>
            <Progress 
              value={(challenge.progress / challenge.target) * 100} 
              className="h-1.5"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="font-semibold">Active Challenges</h2>
          <p className="text-sm text-muted-foreground">Complete for bonus XP!</p>
        </div>
      </div>

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            className={cn(
              "p-5 rounded-2xl border transition-all",
              challenge.completed 
                ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30" 
                : "bg-card border-border hover:border-primary/30"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  challenge.type === 'weekly' 
                    ? "bg-primary/20" 
                    : "bg-accent/20"
                )}>
                  {challenge.type === 'weekly' ? (
                    <Calendar className="w-6 h-6 text-primary" />
                  ) : (
                    <Target className="w-6 h-6 text-accent" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {challenge.type} Challenge
                    </span>
                    {challenge.completed && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        Completed!
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{challenge.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-xp">+{challenge.reward} XP</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {getTimeRemaining(challenge.endDate)}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">
                  {challenge.progress} / {challenge.target}
                </span>
              </div>
              <Progress 
                value={(challenge.progress / challenge.target) * 100} 
                className="h-2"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
