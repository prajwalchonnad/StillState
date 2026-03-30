import { create } from 'zustand';
import { Task } from '../types';
import { useRewardStore } from './useRewardStore';

interface TaskState {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  
  fetchTasks: () => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  generateTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  activeTasks: [],
  completedTasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    
    // Mock
    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: '1',
          userId: 'user-1',
          type: 'PHYSICAL',
          title: 'Go for a 15-minute walk',
          description: 'Get outside and enjoy a brief walk to refresh your mind and rest your eyes.',
          difficulty: 1,
          points: 100,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'user-1',
          type: 'CREATIVE',
          title: 'Draw a futuristic city',
          description: 'Take some paper and markers and design a city from the year 3000.',
          difficulty: 2,
          points: 150,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          userId: 'user-1',
          type: 'EDUCATIONAL',
          title: 'Read a book chapter',
          description: 'Read at least one full chapter of a book of your choice offline.',
          difficulty: 2,
          points: 150,
          completed: false,
          createdAt: new Date().toISOString(),
        }
      ];
      
      set({ 
        tasks: mockTasks,
        activeTasks: mockTasks.filter(t => !t.completed),
        completedTasks: mockTasks.filter(t => t.completed),
        isLoading: false 
      });
    }, 800);
  },

  completeTask: async (taskId: string) => {
    // Cross-store integration: completing a task awards points
    const task = get().tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    
    // Optimistic update
    set((state) => {
      const updatedTasks = state.tasks.map(t => 
        t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
      );
      return {
        tasks: updatedTasks,
        activeTasks: updatedTasks.filter(t => !t.completed),
        completedTasks: updatedTasks.filter(t => t.completed)
      };
    });

    // Call Reward Store to add points
    useRewardStore.getState().addPoints(task.points);
    useRewardStore.getState().checkEmptyBadges();
  },

  generateTasks: async () => {
    // Hits Vercel AI function to fetch new personalized tasks in the future
    // For MVP, just logs for now
    await get().fetchTasks();
  }
}));
