import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, SlidersHorizontal, Zap, Flame, Target, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { HabitCard } from '@/components/habits/HabitCard';
import { LevelProgress } from '@/components/stats/LevelProgress';
import { Input } from '@/components/ui/input';
import { CATEGORIES, Category } from '@/types/habit';
import { getCurrentStreak, getLongestStreak, isHabitDueToday } from '@/utils/dates';
import { cn } from '@/lib/utils';

type SortOption = 'name' | 'streak' | 'level' | 'xp' | 'category';

const Dashboard = () => {
  const { habits, userStats } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('streak');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate stats
  const todayHabits = habits.filter(isHabitDueToday);
  const completedToday = todayHabits.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return (h.completions[today] || 0) >= h.goalPerDay;
  }).length;
  const totalStreaks = habits.reduce((sum, h) => sum + getCurrentStreak(h), 0);

  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    let result = [...habits];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(h => h.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'streak':
          return getCurrentStreak(b) - getCurrentStreak(a);
        case 'level':
          return b.xpEarned - a.xpEarned;
        case 'xp':
          return b.xpEarned - a.xpEarned;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return result;
  }, [habits, searchQuery, sortBy, filterCategory]);

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative text-center py-12 md:py-16 px-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              Build Better Habits{' '}
              <span className="text-gradient-primary">Every Day</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Track your progress, stay consistent, and level up your routine.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/add">
                <motion.button
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg glow-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Target className="w-5 h-5" />
                  Start Tracking
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient-primary">{userStats.title}</span>! 
          </h2>
          <p className="text-muted-foreground">
            {completedToday === todayHabits.length && todayHabits.length > 0
              ? "🎉 Amazing! You've completed all habits for today!"
              : `You have ${todayHabits.length - completedToday} habit${todayHabits.length - completedToday !== 1 ? 's' : ''} left today`
            }
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedToday}/{todayHabits.length}</div>
                <div className="text-xs text-muted-foreground">Today</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-streak/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-streak" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalStreaks}</div>
                <div className="text-xs text-muted-foreground">Total Streaks</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-xp" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userStats.totalXP}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-level/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-level" />
              </div>
              <div>
                <div className="text-2xl font-bold">{habits.length}</div>
                <div className="text-xs text-muted-foreground">Habits</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level Progress */}
        <LevelProgress compact />

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search habits..."
                className="pl-10 h-12"
              />
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "px-4 h-12 rounded-xl border flex items-center gap-2 transition-colors",
                showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Filters</span>
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'streak', label: 'Highest Streak' },
                        { value: 'name', label: 'A-Z' },
                        { value: 'xp', label: 'Most XP' },
                        { value: 'category', label: 'Category' },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as SortOption)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                            sortBy === option.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Category */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilterCategory('all')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          filterCategory === 'all'
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        All
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setFilterCategory(cat.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                            filterCategory === cat.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80"
                          )}
                        >
                          <span>{cat.icon}</span>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map((habit, index) => (
              <HabitCard key={habit.id} habit={habit} index={index} />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">No habits yet!</h3>
            <p className="text-muted-foreground mb-6">
              Start building better habits today
            </p>
            <Link to="/add">
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Create Your First Habit
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No habits match your search</p>
          </motion.div>
        )}

        {/* Floating Add Button (Mobile) */}
        <Link to="/add" className="md:hidden fixed right-4 bottom-20 z-40">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg glow-primary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
