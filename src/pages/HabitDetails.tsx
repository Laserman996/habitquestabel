import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  Flame, 
  Zap, 
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Award,
  X,
  Check
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { HeatmapCalendar } from '@/components/habits/HeatmapCalendar';
import { AddHabitForm } from '@/components/habits/AddHabitForm';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CATEGORIES } from '@/types/habit';
import { 
  getCurrentStreak, 
  getLongestStreak, 
  getWeeklyProgress, 
  getMonthlyProgress,
  formatDate,
  DAY_NAMES
} from '@/utils/dates';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const HabitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHabitById, deleteHabit, updateHabit, togglePastDay } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const habit = getHabitById(id || '');

  useEffect(() => {
    if (!habit && id) {
      navigate('/');
    }
  }, [habit, id, navigate]);

  if (!habit) {
    return null;
  }

  const category = CATEGORIES.find(c => c.value === habit.category);
  const currentStreak = getCurrentStreak(habit);
  const longestStreak = getLongestStreak(habit);
  const weeklyProgress = getWeeklyProgress(habit);
  const monthlyProgress = getMonthlyProgress(habit);

  const handleDelete = () => {
    deleteHabit(habit.id);
    toast.success('Habit deleted');
    navigate('/');
  };

  const handleReset = () => {
    updateHabit({
      ...habit,
      completions: {},
      xpEarned: 0,
    });
    toast.success('Habit history reset');
    setShowDeleteConfirm(false);
  };

  const handleDayClick = (dateString: string) => {
    togglePastDay(habit.id, dateString);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.div
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{category?.icon}</span>
                <h1 className="text-2xl font-bold">{habit.name}</h1>
              </div>
              <p className="text-muted-foreground">{habit.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-streak/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-streak" />
              </div>
              <div>
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-xp" />
              </div>
              <div>
                <div className="text-2xl font-bold">{longestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
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
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{weeklyProgress}%</div>
                <div className="text-xs text-muted-foreground">This Week</div>
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
              <div className="w-10 h-10 rounded-xl bg-level/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-level" />
              </div>
              <div>
                <div className="text-2xl font-bold">{habit.xpEarned}</div>
                <div className="text-xs text-muted-foreground">XP Earned</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl bg-card border border-border space-y-4"
        >
          <h3 className="font-semibold">Completion Rate</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Weekly</span>
                <span className="font-medium">{weeklyProgress}%</span>
              </div>
              <Progress value={weeklyProgress} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-medium">{monthlyProgress}%</span>
              </div>
              <Progress value={monthlyProgress} className="h-3" />
            </div>
          </div>
        </motion.div>

        {/* Heatmap Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HeatmapCalendar habit={habit} onDayClick={handleDayClick} />
        </motion.div>

        {/* Habit Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <h3 className="font-semibold mb-4">Habit Details</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">{formatDate(habit.createdAt)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Target className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Daily Goal</div>
                <div className="font-medium">{habit.goalPerDay}x per day</div>
              </div>
            </div>

            <div className="md:col-span-2 p-3 rounded-xl bg-secondary/50">
              <div className="text-sm text-muted-foreground mb-2">Schedule</div>
              <div className="flex flex-wrap gap-2">
                {habit.frequency === 'daily' ? (
                  <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm font-medium">
                    Every Day
                  </span>
                ) : (
                  habit.specificDays.map(day => (
                    <span key={day} className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm font-medium">
                      {DAY_NAMES[day]}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 h-12"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset History
          </Button>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 z-50 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg"
            >
              <div className="h-full overflow-auto rounded-2xl bg-card border border-border shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Edit Habit</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <AddHabitForm onClose={() => setIsEditing(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-4"
            >
              <div className="rounded-2xl bg-card border border-border shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Delete or Reset?</h3>
                  <p className="text-muted-foreground">
                    What would you like to do with this habit?
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full h-12"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset History Only
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="w-full h-12"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Habit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default HabitDetails;
