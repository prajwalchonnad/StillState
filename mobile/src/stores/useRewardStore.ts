import { create } from 'zustand';
import { Reward } from '../types';

interface RewardState {
  points: number;
  badges: Reward[];
  streak: number;
  isLoading: boolean;
  
  fetchRewards: () => Promise<void>;
  addPoints: (amount: number) => void;
  checkEmptyBadges: () => void;
  incrementStreak: () => void;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  points: 0,
  badges: [],
  streak: 0,
  isLoading: false,

  fetchRewards: async () => {
    set({ isLoading: true });
    
    // Mock
    setTimeout(() => {
      const mockBadges: Reward[] = [
        { id: '1', userId: 'user-1', type: 'BADGE', name: 'First Step', description: 'Completed first task', threshold: 100, earned: true, earnedAt: new Date().toISOString(), iconName: 'target' },
        { id: '2', userId: 'user-1', type: 'BADGE', name: 'Consistent', description: '3 day streak', threshold: 3, earned: false, iconName: 'flame' },
        { id: '3', userId: 'user-1', type: 'MILESTONE', name: 'Points Master', description: 'Earn 1000 points', threshold: 1000, earned: false, iconName: 'star' },
      ];
      
      set({ points: 200, badges: mockBadges, streak: 1, isLoading: false });
    }, 600);
  },

  addPoints: (amount: number) => {
    set((state) => ({ points: state.points + amount }));
  },

  checkEmptyBadges: () => {
    // Basic logic to check if any unearned badge threshold has been met
    const state = get();
    let changed = false;
    const newBadges = state.badges.map(badge => {
      if (!badge.earned) {
        if (badge.type === 'MILESTONE' && state.points >= badge.threshold) {
          changed = true;
          return { ...badge, earned: true, earnedAt: new Date().toISOString() };
        }
        if (badge.type === 'BADGE' && badge.threshold <= state.points) { // simplified condition for testing
          changed = true;
          return { ...badge, earned: true, earnedAt: new Date().toISOString() };
        }
      }
      return badge;
    });

    if (changed) {
      set({ badges: newBadges });
    }
  },

  incrementStreak: () => {
    set((state) => ({ streak: state.streak + 1 }));
    get().checkEmptyBadges();
  }
}));
