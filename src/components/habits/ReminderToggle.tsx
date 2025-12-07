import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HabitReminder } from '@/types/habit';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReminderToggleProps {
  reminder?: HabitReminder;
  onChange: (reminder: HabitReminder) => void;
}

export const ReminderToggle = ({ reminder, onChange }: ReminderToggleProps) => {
  const { requestPermission, isSupported, permission } = useNotifications();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      setIsRequesting(true);
      const granted = await requestPermission();
      setIsRequesting(false);
      
      if (!granted) {
        toast.error('Notification permission denied', {
          description: 'Please enable notifications in your browser settings',
        });
        return;
      }
      toast.success('Notifications enabled!');
    }

    onChange({
      enabled,
      time: reminder?.time || '09:00',
    });
  };

  const handleTimeChange = (time: string) => {
    onChange({
      enabled: reminder?.enabled ?? false,
      time,
    });
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3 text-muted-foreground">
          <BellOff className="w-5 h-5" />
          <span className="text-sm">Notifications not supported in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            reminder?.enabled ? "bg-primary/20" : "bg-muted"
          )}>
            {reminder?.enabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <Label className="font-medium">Daily Reminder</Label>
            <p className="text-sm text-muted-foreground">
              Get notified to complete this habit
            </p>
          </div>
        </div>
        <Switch
          checked={reminder?.enabled ?? false}
          onCheckedChange={handleToggle}
          disabled={isRequesting}
        />
      </div>

      {reminder?.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-3 pl-13"
        >
          <Clock className="w-5 h-5 text-muted-foreground" />
          <Input
            type="time"
            value={reminder.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-32"
          />
          <span className="text-sm text-muted-foreground">
            Remind me at this time
          </span>
        </motion.div>
      )}
    </div>
  );
};
