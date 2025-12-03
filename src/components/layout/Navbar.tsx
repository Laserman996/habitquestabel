import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, Trophy, Settings, Zap, Sun, Moon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/add', icon: Plus, label: 'Add' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Navbar = () => {
  const location = useLocation();
  const { userStats, theme, toggleTheme } = useApp();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-bold text-xl">HabitQuest</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={cn(
                    "px-4 py-2 rounded-xl flex items-center gap-2 transition-colors",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* User Stats & Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary">
              <div className="flex items-center gap-1">
                <span className="text-xp font-bold">Lvl {userStats.level}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-xp" />
                <span className="font-semibold">{userStats.totalXP} XP</span>
              </div>
            </div>
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-xp" />
              ) : (
                <Moon className="w-5 h-5 text-accent" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.div
                  className={cn(
                    "flex flex-col items-center justify-center py-2 rounded-xl mx-1",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">HabitQuest</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary text-sm">
              <span className="text-xp font-bold">Lvl {userStats.level}</span>
              <Zap className="w-3 h-3 text-xp" />
              <span className="font-semibold">{userStats.totalXP}</span>
            </div>
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary"
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-xp" />
              ) : (
                <Moon className="w-4 h-4 text-accent" />
              )}
            </motion.button>
          </div>
        </div>
      </header>
    </>
  );
};
