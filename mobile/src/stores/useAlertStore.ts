import { create } from 'zustand';
import { Alert } from '../types';

interface AlertState {
  activeAlerts: Alert[];
  alertHistory: Alert[];
  isLoading: boolean;
  
  fetchAlerts: () => Promise<void>;
  dismissAlert: (alertId: string) => void;
  triggerAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  activeAlerts: [],
  alertHistory: [],
  isLoading: false,

  fetchAlerts: async () => {
    set({ isLoading: true });
    
    // Mock
    setTimeout(() => {
      const mockAlerts: Alert[] = [
        { id: '1', userId: 'user-1', type: 'EYE_BREAK', severity: 'LOW', message: 'Time for the 20-20-20 rule! Look at something 20 feet away for 20 seconds.', read: false, timestamp: new Date().toISOString() },
        { id: '2', userId: 'user-1', type: 'USAGE_WARNING', severity: 'MEDIUM', message: "You've been on your screen for an hour. Consider taking a break.", read: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
      ];
      
      set({ 
        activeAlerts: mockAlerts.filter(a => !a.read),
        alertHistory: mockAlerts.filter(a => a.read),
        isLoading: false 
      });
    }, 700);
  },

  dismissAlert: (alertId: string) => {
    set((state) => {
      const alert = state.activeAlerts.find(a => a.id === alertId);
      if (!alert) return state;

      const updatedAlert = { ...alert, read: true };
      return {
        activeAlerts: state.activeAlerts.filter(a => a.id !== alertId),
        alertHistory: [updatedAlert, ...state.alertHistory],
      };
    });
  },

  triggerAlert: (baseAlert) => {
    const newAlert: Alert = {
      ...baseAlert,
      id: Math.random().toString(36).substring(7),
      read: false,
      timestamp: new Date().toISOString()
    };

    set((state) => ({
      activeAlerts: [newAlert, ...state.activeAlerts]
    }));
  }
}));
