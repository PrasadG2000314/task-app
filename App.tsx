
import React, { useState, useEffect, useCallback } from 'react';
import { DailyTasks } from './components/DailyTasks';
import { BalanceTracker } from './components/BalanceTracker';
import { WeeklyReport } from './components/WeeklyReport';
import { storageService } from './services/storageService';
import { SunIcon, MoonIcon, CheckCircleIcon, HeartIcon, ChartBarIcon, UserCircleIcon, XMarkIcon } from './components/icons/Icons';
import { Task, DailyLog } from './types';

type View = 'daily' | 'balance' | 'report';

const App: React.FC = () => {
  const [theme, setTheme] = useState(storageService.getTheme());
  const [name, setName] = useState<string | null>(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [currentView, setCurrentView] = useState<View>('daily');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyLog, setDailyLog] = useState<DailyLog>(storageService.getDailyLog(new Date()));

  const today = new Date();

  const loadData = useCallback(() => {
    const storedName = storageService.getAppName();
    if (!storedName) {
      setIsNameModalOpen(true);
    } else {
      setName(storedName);
      setNameInput(storedName);
    }
    setTasks(storageService.getTasks());
    setDailyLog(storageService.getDailyLog(today));
  }, [today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      storageService.setAppName(nameInput.trim());
      setName(nameInput.trim());
      setIsNameModalOpen(false);
    }
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    storageService.saveTasks(newTasks);
  };
  
  const updateDailyLog = (newLog: DailyLog) => {
    setDailyLog(newLog);
    storageService.saveDailyLog(today, newLog);
  }

  const renderView = () => {
    switch (currentView) {
      case 'daily':
        return <DailyTasks tasks={tasks} setTasks={updateTasks} dailyLog={dailyLog} setDailyLog={updateDailyLog} />;
      case 'balance':
        return <BalanceTracker dailyLog={dailyLog} setDailyLog={updateDailyLog} />;
      case 'report':
        return <WeeklyReport />;
      default:
        return <DailyTasks tasks={tasks} setTasks={updateTasks} dailyLog={dailyLog} setDailyLog={updateDailyLog} />;
    }
  };

  const NavItem = ({ view, label, icon }: { view: View; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view
          ? 'bg-primary-500 text-white shadow-lg'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2 bg-primary-500 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Zenith</h1>
          </div>
          <nav className="space-y-4">
            <NavItem view="daily" label="Daily Routine" icon={<CheckCircleIcon className="w-6 h-6" />} />
            <NavItem view="balance" label="Life Balance" icon={<HeartIcon className="w-6 h-6" />} />
            <NavItem view="report" label="Weekly Report" icon={<ChartBarIcon className="w-6 h-6" />} />
          </nav>
        </div>
        <div className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
           <button onClick={() => setIsNameModalOpen(true)} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 w-full hover:text-primary-500 dark:hover:text-primary-400">
             <UserCircleIcon className="w-6 h-6"/>
             <span className="font-medium truncate">{name || "Set Name"}</span>
           </button>
           <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {theme === 'light' ? <MoonIcon className="w-6 h-6 text-gray-700" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {`Hello, ${name || 'there'}!`}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
                {`Today is ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Let's make it a great one.`}
            </p>
        </header>
        {renderView()}
      </main>

      {/* Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Welcome to Zenith!</h3>
                <button onClick={() => setIsNameModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">What should we call you?</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            />
            <button
              onClick={handleNameSave}
              className="mt-6 w-full bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 disabled:opacity-50"
              disabled={!nameInput.trim()}
            >
              Save and Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
