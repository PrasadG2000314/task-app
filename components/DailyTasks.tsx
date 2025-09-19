import React, { useState } from 'react';
import { Task, DailyLog, TaskPriority } from '../types';
import { Card } from './ui/Card';
import { PlusIcon, TrashIcon, CheckCircleIcon } from './icons/Icons';

interface DailyTasksProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  dailyLog: DailyLog;
  setDailyLog: (log: DailyLog) => void;
}

const priorityClasses = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const categoryClasses = {
    personal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    work: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export const DailyTasks: React.FC<DailyTasksProps> = ({ tasks, setTasks, dailyLog, setDailyLog }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('personal');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      priority: newTaskPriority,
      category: newTaskCategory,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setNewTaskCategory('personal');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    // Also remove from completed tasks if it was completed
    if (dailyLog.completedTasks.includes(taskId)) {
        setDailyLog({
            ...dailyLog,
            completedTasks: dailyLog.completedTasks.filter(id => id !== taskId)
        });
    }
  };

  const handleToggleTask = (taskId: string) => {
    const isCompleted = dailyLog.completedTasks.includes(taskId);
    const newCompletedTasks = isCompleted
      ? dailyLog.completedTasks.filter(id => id !== taskId)
      : [...dailyLog.completedTasks, taskId];
    
    setDailyLog({ ...dailyLog, completedTasks: newCompletedTasks });
  };

  const progress = tasks.length > 0 ? (dailyLog.completedTasks.length / tasks.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <Card title="Add a New Task" icon={<PlusIcon className="w-6 h-6" />}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What's your next task?"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <div className="flex gap-4">
             <select 
                value={newTaskPriority} 
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
             >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
             </select>
             <select 
                value={newTaskCategory} 
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
             >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
             </select>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-primary-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
      </Card>
      
      <Card title="Today's Tasks" icon={<CheckCircleIcon className="w-6 h-6" />}>
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-sm font-bold text-primary-500 dark:text-primary-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map(task => {
              const isCompleted = dailyLog.completedTasks.includes(task.id);
              return (
                <li
                  key={task.id}
                  className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-all"
                >
                  <button onClick={() => handleToggleTask(task.id)} className="mr-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isCompleted ? 'bg-primary-500 border-primary-500' : 'border-gray-400'
                    }`}>
                        {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                  <span className={`flex-grow ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.text}
                  </span>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${categoryClasses[task.category as keyof typeof categoryClasses] || categoryClasses.other}`}>
                        {task.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${priorityClasses[task.priority]}`}>
                        {task.priority}
                    </span>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks for today. Add one to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
};
