import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';
import { Friend } from '@/types/habit';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddFriendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editFriend?: Friend | null;
}

export const AddFriendDialog = ({ isOpen, onClose, editFriend }: AddFriendDialogProps) => {
  const { addFriend, updateFriend } = useApp();
  
  const [name, setName] = useState('');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (editFriend) {
      setName(editFriend.name);
      setXp(editFriend.xp);
      setLevel(editFriend.level);
    } else {
      setName('');
      setXp(0);
      setLevel(1);
    }
  }, [editFriend, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (editFriend) {
      updateFriend({
        ...editFriend,
        name: name.trim(),
        xp,
        level,
      });
      toast.success('Friend updated!');
    } else {
      addFriend(name.trim(), xp, level);
      toast.success('Friend added to leaderboard!');
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="rounded-2xl bg-card border border-border shadow-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {editFriend ? 'Edit Friend' : 'Add Friend'}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="friendName">Friend's Name</Label>
                  <Input
                    id="friendName"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter name"
                    className="h-12"
                    maxLength={30}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="friendLevel">Level</Label>
                    <Input
                      id="friendLevel"
                      type="number"
                      value={level}
                      onChange={e => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
                      className="h-12"
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="friendXp">Total XP</Label>
                    <Input
                      id="friendXp"
                      type="number"
                      value={xp}
                      onChange={e => setXp(Math.max(0, parseInt(e.target.value) || 0))}
                      className="h-12"
                      min={0}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Add your friends manually to compare progress. This data stays on your device only.
                </p>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 h-12">
                    {editFriend ? 'Update' : 'Add Friend'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
