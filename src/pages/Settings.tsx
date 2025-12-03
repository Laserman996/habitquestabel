import { motion } from 'framer-motion';
import { Sun, Moon, Palette, Shield, Zap, Award, RotateCcw, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { RewardsList } from '@/components/stats/RewardsList';
import { LevelProgress } from '@/components/stats/LevelProgress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Settings = () => {
  const { theme, toggleTheme, userStats, habits } = useApp();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your experience
          </p>
        </motion.div>

        {/* Level Progress */}
        <LevelProgress />

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose your theme</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                theme === 'light'
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="font-medium">Light</span>
            </motion.button>

            <motion.button
              onClick={() => theme === 'light' && toggleTheme()}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                theme === 'dark'
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center">
                <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-medium">Dark</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-xp" />
            </div>
            <div>
              <h2 className="font-semibold">Your Stats</h2>
              <p className="text-sm text-muted-foreground">Your habit journey</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-2xl font-bold">{habits.length}</div>
              <div className="text-sm text-muted-foreground">Total Habits</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-2xl font-bold">{userStats.totalXP}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-2xl font-bold">{userStats.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-2xl font-bold">{userStats.unlockedRewards.length}</div>
              <div className="text-sm text-muted-foreground">Rewards Unlocked</div>
            </div>
          </div>
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <RewardsList />
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Privacy & Data</h2>
              <p className="text-sm text-muted-foreground">How your data is stored</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-xs">✓</span>
              </div>
              <p>All data is stored locally in your browser's localStorage</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-xs">✓</span>
              </div>
              <p>No accounts required - completely offline</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-xs">✓</span>
              </div>
              <p>No personal data is ever sent to any server</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-success text-xs">✓</span>
              </div>
              <p>Safe for all ages - no in-app purchases or ads</p>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary" />
            <span className="font-semibold">HabitQuest</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for building better habits
          </p>
          <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
