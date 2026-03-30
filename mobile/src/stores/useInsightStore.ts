import { create } from 'zustand';
import { AppCategory, BehaviorPattern } from '../types';

interface InsightState {
  riskScore: number;
  dominantCategory: AppCategory;
  behaviorPatterns: BehaviorPattern[];
  recommendations: string[];
  isLoading: boolean;
  
  fetchInsights: () => Promise<void>;
  updateRiskScore: (newScore: number) => void;
}

export const useInsightStore = create<InsightState>((set) => ({
  riskScore: 0,
  dominantCategory: 'OTHER',
  behaviorPatterns: [],
  recommendations: [],
  isLoading: false,

  fetchInsights: async () => {
    set({ isLoading: true });
    
    // Mock
    setTimeout(() => {
      const mockPatterns: BehaviorPattern[] = [
        { id: '1', name: 'Continuous Usage', description: 'Over 60 mins of unbroken screen time', dateDetected: new Date().toISOString() },
        { id: '2', name: 'Rapid App Switching', description: 'Changing apps more than 8 times in 10 minutes', dateDetected: new Date().toISOString() },
      ];
      
      const mockRecommendations = [
        'Consider setting a 45-minute limit on gaming.',
        'Take more frequent eye breaks.',
        'Encourage 30 minutes of outdoor play.'
      ];

      set({ 
        riskScore: 45, 
        dominantCategory: 'GAMING', 
        behaviorPatterns: mockPatterns, 
        recommendations: mockRecommendations,
        isLoading: false 
      });
    }, 900);
  },

  updateRiskScore: (newScore: number) => {
    set({ riskScore: Math.min(Math.max(newScore, 0), 100) });
  }
}));
