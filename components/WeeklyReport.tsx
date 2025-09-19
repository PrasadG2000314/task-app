import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { ChartBarIcon } from './icons/Icons';
import { storageService } from '../services/storageService';
import { WeeklyReportData, Task, Mood } from '../types';
import { GoogleGenAI } from '@google/genai';

// As per guidelines, API_KEY is expected to be in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const moodToText = (mood: Mood | null): string => {
    if (mood === null) return 'Not logged';
    switch(mood) {
        case Mood.Awesome: return 'Awesome';
        case Mood.Good: return 'Good';
        case Mood.Okay: return 'Okay';
        case Mood.Bad: return 'Bad';
        case Mood.Awful: return 'Awful';
        default: return 'N/A';
    }
};

export const WeeklyReport: React.FC = () => {
  const [reportData, setReportData] = useState<WeeklyReportData[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const today = new Date();
        const last7DaysData: WeeklyReportData[] = [];
        // Note: Task completion is calculated against the current list of tasks.
        // For a more accurate report, tasks should be snapshotted daily. This is a limitation of the current app structure.
        const allTasks: Task[] = storageService.getTasks();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          const log = storageService.getDailyLog(date);
          const taskCompletion = allTasks.length > 0 ? (log.completedTasks.length / allTasks.length) * 100 : 0;

          last7DaysData.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            taskCompletion: Math.round(taskCompletion),
            mood: log.mood,
          });
        }
        setReportData(last7DaysData);

        // Generate AI Summary
        const prompt = `
        Analyze the following weekly data from a user's productivity and mood tracking app.
        The data covers the last 7 days. 'taskCompletion' is a percentage, and 'mood' is a string representation of their feeling. 'Not logged' means the user did not record their mood.

        Data:
        ${JSON.stringify(last7DaysData.map(d => ({ date: d.date, taskCompletion: d.taskCompletion, mood: moodToText(d.mood) })))}

        Based on this data, provide a short (2-3 sentences), encouraging, and insightful summary of the week.
        Highlight any positive trends or achievements.
        Then, offer one simple, actionable tip for the upcoming week to help them improve their well-being or productivity.
        Address the user directly (e.g., "This week, you..."). Format your response in a friendly and supportive tone. Do not use markdown characters like '*' or '#'.
        `;

        try {
            // Fix: Correctly call the Gemini API and extract the text response.
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setSummary(result.text);
        } catch (e) {
            console.error("Error generating AI summary:", e);
            setSummary("Could not generate AI summary at this time. Please check your internet connection or API key configuration.");
        }
        
      } catch (e) {
        console.error("Error generating report:", e);
        setError("Could not generate the weekly report.");
      } finally {
        setIsLoading(false);
      }
    };

    generateReport();
  }, []);

  return (
    <div className="space-y-8">
      <Card title="Your Weekly Snapshot" icon={<ChartBarIcon className="w-7 h-7" />}>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Generating your weekly report...</p>
          </div>
        ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-center items-end" style={{height: '250px'}}>
              {reportData.map((data, index) => (
                <div key={index} className="flex flex-col h-full justify-end items-center">
                  <div 
                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-end group relative"
                    title={`Task Completion: ${data.taskCompletion}%`}
                  >
                    <div
                      className="w-full bg-primary-500 rounded-lg transition-all duration-500"
                      style={{ height: `${data.taskCompletion || 1}%` }} // use 1% for visibility on 0%
                    ></div>
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none">
                        {data.taskCompletion}%
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">{data.date}</p>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Task Completion (%)</p>
            </div>
          </div>
        )}
      </Card>
      
      <Card title="AI-Powered Insights" icon={<ChartBarIcon className="w-7 h-7" />}>
         {isLoading ? (
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
         ) : (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{summary || "No summary available."}</p>
         )}
      </Card>

    </div>
  );
};
