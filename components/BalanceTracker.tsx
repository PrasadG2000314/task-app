
import React from 'react';
import { Card } from './ui/Card';
import { DailyLog, Mood } from '../types';
import { HeartIcon } from './icons/Icons';

interface BalanceTrackerProps {
  dailyLog: DailyLog;
  setDailyLog: (log: DailyLog) => void;
}

const moodOptions = [
  { mood: Mood.Awesome, emoji: '😁', label: 'Awesome' },
  { mood: Mood.Good, emoji: '🙂', label: 'Good' },
  { mood: Mood.Okay, emoji: '😐', label: 'Okay' },
  { mood: Mood.Bad, emoji: '😕', label: 'Bad' },
  { mood: Mood.Awful, emoji: '😠', label: 'Awful' },
];

export const BalanceTracker: React.FC<BalanceTrackerProps> = ({ dailyLog, setDailyLog }) => {
  const handleMoodChange = (mood: Mood) => {
    setDailyLog({ ...dailyLog, mood });
  };

  const handleGratitudeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDailyLog({ ...dailyLog, gratitude: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title="How are you feeling today?" icon={<HeartIcon className="w-7 h-7" />}>
        <div className="flex justify-around items-center py-4">
          {moodOptions.map(({ mood, emoji, label }) => (
            <button
              key={mood}
              onClick={() => handleMoodChange(mood)}
              className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                dailyLog.mood === mood 
                ? 'bg-primary-100 dark:bg-primary-900 scale-110' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className={`text-sm font-medium ${dailyLog.mood === mood ? 'text-primary-600 dark:text-primary-300' : 'text-gray-500'}`}>{label}</span>
            </button>
          ))}
        </div>
      </Card>
      <Card title="Gratitude Journal" icon={<HeartIcon className="w-7 h-7" />}>
        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">What is one thing you are grateful for today?</p>
        <textarea
          value={dailyLog.gratitude}
          onChange={handleGratitudeChange}
          placeholder="I'm grateful for..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
        />
      </Card>
    </div>
  );
};
