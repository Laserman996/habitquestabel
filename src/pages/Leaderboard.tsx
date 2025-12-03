import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, UserPlus, ArrowUpDown, Users, Crown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { FriendCard } from '@/components/leaderboard/FriendCard';
import { AddFriendDialog } from '@/components/leaderboard/AddFriendDialog';
import { Friend } from '@/types/habit';
import { cn } from '@/lib/utils';

type SortBy = 'xp' | 'level';

const Leaderboard = () => {
  const { friends, userStats } = useApp();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('xp');

  // Create a "self" entry for the leaderboard
  const selfEntry: Friend = {
    id: 'self',
    name: 'You',
    xp: userStats.totalXP,
    level: userStats.level,
  };

  // Combine and sort all entries
  const allEntries = [...friends, selfEntry].sort((a, b) => {
    if (sortBy === 'xp') return b.xp - a.xp;
    return b.level - a.level;
  });

  const handleEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setShowAddFriend(true);
  };

  const handleCloseDialog = () => {
    setShowAddFriend(false);
    setEditingFriend(null);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-950" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Compare your progress with friends (local only)
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('xp')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
                sortBy === 'xp'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <ArrowUpDown className="w-4 h-4" />
              By XP
            </button>
            <button
              onClick={() => setSortBy('level')}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2",
                sortBy === 'level'
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <Crown className="w-4 h-4" />
              By Level
            </button>
          </div>

          <motion.button
            onClick={() => setShowAddFriend(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Friend</span>
          </motion.button>
        </motion.div>

        {/* Leaderboard List */}
        {allEntries.length > 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {allEntries.map((entry, index) => (
              <FriendCard
                key={entry.id}
                friend={entry}
                rank={index + 1}
                isCurrentUser={entry.id === 'self'}
                onEdit={handleEditFriend}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Friends Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add friends to start competing!
            </p>
            <motion.button
              onClick={() => setShowAddFriend(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" />
              Add Your First Friend
            </motion.button>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-secondary/50 border border-border"
        >
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span>🔒</span> Privacy First
          </h4>
          <p className="text-sm text-muted-foreground">
            This leaderboard is completely local. You manually add friends and their scores - 
            no data is shared online. It's just for friendly, offline competition!
          </p>
        </motion.div>
      </div>

      {/* Add/Edit Friend Dialog */}
      <AddFriendDialog
        isOpen={showAddFriend}
        onClose={handleCloseDialog}
        editFriend={editingFriend}
      />
    </Layout>
  );
};

export default Leaderboard;
