import { Task, DailyLog, Mood } from '../types';

const APP_NAME_KEY = 'zenith_app_name';
const THEME_KEY = 'zenith_theme';
const TASKS_KEY = 'zenith_tasks';
const DAILY_LOG_PREFIX = 'zenith_daily_log_';

const getTodayDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const getAppName = (): string | null => {
    return localStorage.getItem(APP_NAME_KEY);
};

const setAppName = (name: string): void => {
    localStorage.setItem(APP_NAME_KEY, name);
};

const getTheme = (): 'light' | 'dark' => {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark') return 'dark';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

const setTheme = (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
};

const getTasks = (): Task[] => {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    if (!tasksJson) return [];

    const tasks: any[] = JSON.parse(tasksJson);

    // Migration for tasks created before priority or category was a feature
    return tasks.map(task => ({
        ...task,
        priority: task.priority || 'medium',
        category: task.category || 'personal'
    }));
};

const saveTasks = (tasks: Task[]): void => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

const getDailyLog = (date: Date): DailyLog => {
    const dateString = getTodayDateString(date);
    const logJson = localStorage.getItem(`${DAILY_LOG_PREFIX}${dateString}`);
    const defaultLog: DailyLog = {
        completedTasks: [],
        mood: null,
        gratitude: '',
    };
    return logJson ? JSON.parse(logJson) : defaultLog;
};

const saveDailyLog = (date: Date, log: DailyLog): void => {
    const dateString = getTodayDateString(date);
    localStorage.setItem(`${DAILY_LOG_PREFIX}${dateString}`, JSON.stringify(log));
};

export const storageService = {
    getAppName,
    setAppName,
    getTheme,
    setTheme,
    getTasks,
    saveTasks,
    getDailyLog,
    saveDailyLog
};