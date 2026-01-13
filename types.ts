
export enum TabType {
  HEALTH = 'Health',
  BUDGET = 'Budget',
  ASSISTANT = 'Assistant',
  TODO = 'To Do\'s',
  LIBRARY = 'Library',
  SETTINGS = 'Settings'
}

export interface HealthData {
  steps: number;
  calories: number;
  heartRate: number;
  sleepHours: number;
  activityMinutes: number;
}

export interface Reminder {
  id: string;
  title: string;
  dateTime: string;
  location?: string;
  sourceType: 'image' | 'manual';
}
