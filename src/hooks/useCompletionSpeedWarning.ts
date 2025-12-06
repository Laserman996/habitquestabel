import { useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

const FAST_COMPLETION_THRESHOLD_MS = 2000; // 2 seconds between completions
const MIN_COMPLETIONS_FOR_WARNING = 3; // Warn after 3+ fast completions

export const useCompletionSpeedWarning = () => {
  const completionTimestamps = useRef<number[]>([]);
  const warningShown = useRef(false);

  const trackCompletion = useCallback(() => {
    const now = Date.now();
    completionTimestamps.current.push(now);
    
    // Keep only recent timestamps (last 10 seconds)
    const tenSecondsAgo = now - 10000;
    completionTimestamps.current = completionTimestamps.current.filter(
      (timestamp) => timestamp > tenSecondsAgo
    );

    // Check for rapid completions
    const recentCompletions = completionTimestamps.current;
    
    if (recentCompletions.length >= MIN_COMPLETIONS_FOR_WARNING && !warningShown.current) {
      // Check if completions are happening too fast
      let fastCount = 0;
      for (let i = 1; i < recentCompletions.length; i++) {
        if (recentCompletions[i] - recentCompletions[i - 1] < FAST_COMPLETION_THRESHOLD_MS) {
          fastCount++;
        }
      }

      if (fastCount >= MIN_COMPLETIONS_FOR_WARNING - 1) {
        warningShown.current = true;
        toast({
          title: "Slow down! 🐢",
          description: "You're completing habits very quickly. Make sure you're actually doing them!",
          variant: "destructive",
        });
        
        // Reset warning after 30 seconds
        setTimeout(() => {
          warningShown.current = false;
          completionTimestamps.current = [];
        }, 30000);
      }
    }
  }, []);

  return { trackCompletion };
};

