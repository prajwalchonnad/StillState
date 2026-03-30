import { create } from 'zustand';
import { UsageLog, AppCategory } from '../types';

interface UsageState {
  logs: UsageLog[];
  dailyTotal: number;
  categoryBreakdown: Record<AppCategory, number>;
  sessionDuration: number;
  isLoading: boolean;
  
  fetchUsage: () => Promise<void>;
  addUsageLog: (log: Omit<UsageLog, 'id' | 'timestamp'>) => void;
  updateSessionDuration: (duration: number) => void;
}

export const useUsageStore = create<UsageState>((set, get) => ({
  logs: [],
  dailyTotal: 0,
  categoryBreakdown: {
    GAMING: 0,
    SOCIAL_MEDIA: 0,
    EDUCATION: 0,
    ENTERTAINMENT: 0,
    OTHER: 0,
  },
  sessionDuration: 0,
  isLoading: false,

  fetchUsage: async () => {
    set({ isLoading: true });
    // Mock simulation
    setTimeout(() => {
      const mockLogs: UsageLog[] = [
        { id: '1', userId: 'user-1', app: 'Minecraft', category: 'GAMING', duration: 3600, timestamp: new Date().toISOString() },
        { id: '2', userId: 'user-1', app: 'YouTube', category: 'ENTERTAINMENT', duration: 1800, timestamp: new Date().toISOString() },
        { id: '3', userId: 'user-1', app: 'Duolingo', category: 'EDUCATION', duration: 1200, timestamp: new Date().toISOString() },
      ];
      
      const categoryBreakdown = {
        GAMING: 3600,
        SOCIAL_MEDIA: 0,
        EDUCATION: 1200,
        ENTERTAINMENT: 1800,
        OTHER: 0,
      };

      set({ 
        logs: mockLogs, 
        dailyTotal: 6600, 
        categoryBreakdown,
        isLoading: false 
      });
    }, 1000);
  },

  addUsageLog: (log) => {
    const newLog: UsageLog = {
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString()
    };
    
    set((state) => {
      const newBreakdown = { ...state.categoryBreakdown };
      newBreakdown[log.category] += log.duration;
      
      return {
        logs: [newLog, ...state.logs],
        dailyTotal: state.dailyTotal + log.duration,
        categoryBreakdown: newBreakdown
      };
    });
  },

  updateSessionDuration: (duration) => set({ sessionDuration: duration }),
}));
