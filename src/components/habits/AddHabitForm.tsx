import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Category, Frequency, CATEGORIES, HABIT_COLORS } from '@/types/habit';
import { DAY_NAMES } from '@/utils/dates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddHabitFormProps {
  onClose?: () => void;
}

export const AddHabitForm = ({ onClose }: AddHabitFormProps) => {
  const navigate = useNavigate();
  const { addHabit } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('health');
  const [color, setColor] = useState('emerald');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [specificDays, setSpecificDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [goalPerDay, setGoalPerDay] = useState(1);

  const toggleDay = (day: number) => {
    setSpecificDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    if (frequency === 'specific' && specificDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    addHabit({
      name: name.trim(),
      description: description.trim(),
      category,
      color,
      frequency,
      specificDays: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : specificDays,
      goalPerDay,
    });

    toast.success('Habit created! Start building your streak 🔥');
    
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Habit Name</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g., Morning Meditation"
          className="h-12"
          maxLength={50}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What's this habit about?"
          rows={3}
          maxLength={200}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                category === cat.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex gap-3">
          {HABIT_COLORS.map(c => (
            <motion.button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={cn(
                "w-10 h-10 rounded-xl transition-all",
                c.class,
                color === c.value && "ring-2 ring-offset-2 ring-offset-background ring-primary"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => setFrequency('daily')}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border transition-all font-medium",
              frequency === 'daily'
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Every Day
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setFrequency('specific')}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border transition-all font-medium",
              frequency === 'specific'
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Specific Days
          </motion.button>
        </div>
      </div>

      {/* Specific Days */}
      {frequency === 'specific' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          <Label>Select Days</Label>
          <div className="flex gap-2">
            {DAY_NAMES.map((day, index) => (
              <motion.button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={cn(
                  "flex-1 py-2 rounded-xl border transition-all text-sm font-medium",
                  specificDays.includes(index)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Goal per day */}
      <div className="space-y-2">
        <Label htmlFor="goal">Times per day</Label>
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={() => setGoalPerDay(Math.max(1, goalPerDay - 1))}
            className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            -
          </motion.button>
          <Input
            id="goal"
            type="number"
            value={goalPerDay}
            onChange={e => setGoalPerDay(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-20 h-10 text-center"
            min={1}
            max={10}
          />
          <motion.button
            type="button"
            onClick={() => setGoalPerDay(Math.min(10, goalPerDay + 1))}
            className="w-10 h-10 rounded-xl border border-border hover:border-primary/50 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
        </div>
        <p className="text-xs text-muted-foreground">
          Set how many times you want to complete this habit each day
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1 h-12">
          <Plus className="w-4 h-4 mr-2" />
          Create Habit
        </Button>
      </div>
    </form>
  );
};
