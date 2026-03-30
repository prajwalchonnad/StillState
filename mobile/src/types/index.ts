export type AppCategory = 'GAMING' | 'SOCIAL_MEDIA' | 'EDUCATION' | 'ENTERTAINMENT' | 'OTHER';

export interface UsageLog {
  id: string;
  userId: string;
  app: string;
  category: AppCategory;
  duration: number; // seconds
  timestamp: string;
}

export type TaskType = 'PHYSICAL' | 'CREATIVE' | 'EDUCATIONAL' | 'SOCIAL' | 'MINDFULNESS';

export interface Task {
  id: string;
  userId: string;
  type: TaskType;
  title: string;
  description: string;
  difficulty: number; // 1-5
  points: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type RewardType = 'BADGE' | 'MILESTONE' | 'STREAK';

export interface Reward {
  id: string;
  userId: string;
  type: RewardType;
  name: string;
  description?: string;
  threshold: number;
  iconName?: string;
  earned: boolean;
  earnedAt?: string;
}

export type AlertType = 'EYE_BREAK' | 'USAGE_WARNING' | 'RESTRICTED_MODE' | 'ACHIEVEMENT';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  severity: SeverityLevel;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  dateDetected: string;
}
