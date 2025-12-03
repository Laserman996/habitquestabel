import { motion } from 'framer-motion';
import { Habit } from '@/types/habit';
import { getLast60Days, isHabitDueOnDate, isCompletedForDate } from '@/utils/dates';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatmapCalendarProps {
  habit: Habit;
  onDayClick?: (dateString: string) => void;
}

export const HeatmapCalendar = ({ habit, onDayClick }: HeatmapCalendarProps) => {
  const days = getLast60Days();
  
  const getIntensity = (dateString: string): number => {
    if (dateString < habit.createdAt.split('T')[0]) return -1; // Before creation
    if (!isHabitDueOnDate(habit, dateString)) return -2; // Not due
    const completions = habit.completions[dateString] || 0;
    if (completions === 0) return 0;
    return Math.min(completions / habit.goalPerDay, 1);
  };

  const formatDateForTooltip = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusText = (dateString: string): string => {
    const intensity = getIntensity(dateString);
    if (intensity === -1) return 'Before habit created';
    if (intensity === -2) return 'Not scheduled';
    if (intensity === 0) return 'Missed';
    if (intensity < 1) return 'Partial';
    return 'Completed!';
  };

  // Group days by week
  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  
  days.forEach((day, index) => {
    const dayOfWeek = new Date(day).getDay();
    
    // Start new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="p-4 rounded-2xl bg-card border border-border">
      <h3 className="font-semibold mb-4">Activity Heatmap</h3>
      
      {/* Day labels */}
      <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
        <div className="w-6" />
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="w-4 h-4 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            <div className="w-6 text-xs text-muted-foreground flex items-center">
              {weekIndex === 0 || weekIndex === Math.floor(weeks.length / 2) || weekIndex === weeks.length - 1 ? (
                <span className="text-[10px]">
                  {new Date(week[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).split(' ')[0]}
                </span>
              ) : null}
            </div>
            {/* Pad the first week if it doesn't start on Sunday */}
            {weekIndex === 0 && (
              Array.from({ length: new Date(week[0]).getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="w-4 h-4" />
              ))
            )}
            {week.map(day => {
              const intensity = getIntensity(day);
              const isClickable = intensity >= 0 && onDayClick;
              
              return (
                <Tooltip key={day}>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => isClickable && onDayClick(day)}
                      disabled={!isClickable}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all",
                        intensity === -1 && "bg-muted/30",
                        intensity === -2 && "bg-muted/50 opacity-50",
                        intensity === 0 && "bg-destructive/30 hover:bg-destructive/40",
                        intensity > 0 && intensity < 0.5 && "bg-primary/40 hover:bg-primary/50",
                        intensity >= 0.5 && intensity < 1 && "bg-primary/70 hover:bg-primary/80",
                        intensity === 1 && "bg-primary hover:bg-primary/90 glow-primary",
                        isClickable && "cursor-pointer"
                      )}
                      whileHover={isClickable ? { scale: 1.2 } : {}}
                      whileTap={isClickable ? { scale: 0.9 } : {}}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div className="font-medium">{formatDateForTooltip(day)}</div>
                    <div className="text-muted-foreground">{getStatusText(day)}</div>
                    {intensity >= 0 && (
                      <div className="text-muted-foreground">
                        {habit.completions[day] || 0}/{habit.goalPerDay} completed
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-muted/30" />
          <div className="w-4 h-4 rounded-sm bg-destructive/30" />
          <div className="w-4 h-4 rounded-sm bg-primary/40" />
          <div className="w-4 h-4 rounded-sm bg-primary/70" />
          <div className="w-4 h-4 rounded-sm bg-primary" />
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
};
