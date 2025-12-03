import { motion } from 'framer-motion';
import { Edit2, Trash2, Trophy, Zap, User } from 'lucide-react';
import { Friend } from '@/types/habit';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface FriendCardProps {
  friend: Friend;
  rank: number;
  isCurrentUser?: boolean;
  onEdit: (friend: Friend) => void;
}

export const FriendCard = ({ friend, rank, isCurrentUser, onEdit }: FriendCardProps) => {
  const { deleteFriend } = useApp();

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-yellow-950';
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
        isCurrentUser 
          ? "bg-primary/10 border-primary/30 ring-2 ring-primary/20" 
          : "bg-card border-border hover:shadow-soft"
      )}
    >
      {/* Rank */}
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0",
        getRankStyle(rank)
      )}>
        {rank}
      </div>

      {/* Avatar */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-secondary"
      )}>
        {isCurrentUser ? (
          <span className="text-xl font-bold">You</span>
        ) : (
          <User className="w-6 h-6" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">
            {isCurrentUser ? 'You' : friend.name}
          </span>
          {rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="text-level font-medium">Level {friend.level}</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-xp" />
            <span>{friend.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Actions (only for friends, not current user) */}
      {!isCurrentUser && (
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => onEdit(friend)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            onClick={() => deleteFriend(friend.id)}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
