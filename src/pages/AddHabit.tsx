import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AddHabitForm } from '@/components/habits/AddHabitForm';

const AddHabit = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
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
            <h1 className="text-2xl font-bold">Create New Habit</h1>
            <p className="text-muted-foreground">Start building a new habit today</p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">New Habit</h2>
              <p className="text-sm text-muted-foreground">Fill in the details below</p>
            </div>
          </div>

          <AddHabitForm />
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-primary/10 border border-primary/20"
        >
          <h3 className="font-semibold text-primary mb-2">💡 Tips for Success</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Start small - it's better to succeed at something easy</li>
            <li>• Link new habits to existing routines</li>
            <li>• Be specific about what you'll do</li>
            <li>• Track your progress daily for best results</li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AddHabit;
