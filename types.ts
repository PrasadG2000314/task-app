export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  priority: TaskPriority;
  category: string;
}

export enum Mood {
  Awesome = 5,
  Good = 4,
  Okay = 3,
  Bad = 2,
  Awful = 1,
}

export interface DailyLog {
  completedTasks: string[];
  mood: Mood | null;
  gratitude: string;
}

export interface WeeklyReportData {
  date: string;
  taskCompletion: number;
  mood: number | null;
}
