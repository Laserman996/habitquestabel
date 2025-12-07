import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Flame, Zap, Award, TrendingUp } from 'lucide-react';
import { Friend, STREAK_BADGES } from '@/types/habit';
import { getTitleForLevel } from '@/utils/storage';
import { cn } from '@/lib/utils';

interface FriendProfileProps {
  friend: Friend | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendProfile = ({ friend, isOpen, onClose }: FriendProfileProps) => {
  if (!friend) return null;

  const title = getTitleForLevel(friend.level);
  const friendBadges = friend.badges || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-card rounded-2xl border border-border shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-primary/20 to-accent/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{friend.name}</h2>
                  <p className="text-muted-foreground">{title}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-level" />
                  </div>
                  <div className="text-2xl font-bold">{friend.level}</div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="flex justify-center mb-2">
                    <Zap className="w-5 h-5 text-xp" />
                  </div>
                  <div className="text-2xl font-bold">{friend.xp.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="flex justify-center mb-2">
                    <Flame className="w-5 h-5 text-streak" />
                  </div>
                  <div className="text-2xl font-bold">{friend.streak || 0}</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-xp" />
                  <h3 className="font-semibold">Badges</h3>
                </div>
                {friendBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {STREAK_BADGES.filter(b => friendBadges.includes(b.id)).map(badge => (
                      <motion.div
                        key={badge.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.name}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No badges earned yet
                  </p>
                )}
              </div>

              {/* Rank Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-xp/10 to-primary/10 border border-xp/30">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-xp" />
                  <div>
                    <div className="font-semibold">Competitor</div>
                    <p className="text-sm text-muted-foreground">
                      Keep up the friendly competition!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
