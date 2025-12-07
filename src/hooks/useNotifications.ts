import { useEffect, useCallback } from 'react';
import { Habit } from '@/types/habit';

export const useNotifications = () => {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string, icon?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'habit-reminder',
        requireInteraction: true,
      });
    }
  }, []);

  const scheduleReminder = useCallback((habit: Habit) => {
    if (!habit.reminder?.enabled || !habit.reminder.time) return;

    const [hours, minutes] = habit.reminder.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, don't schedule
    if (scheduledTime <= now) return;

    const delay = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      sendNotification(
        `⏰ Habit Reminder: ${habit.name}`,
        "Don't forget your habit today! Keep your streak going 🔥"
      );
    }, delay);
  }, [sendNotification]);

  return {
    requestPermission,
    sendNotification,
    scheduleReminder,
    isSupported: 'Notification' in window,
    permission: typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'denied',
  };
};
