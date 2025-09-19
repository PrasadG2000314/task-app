
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, icon }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-primary-500 dark:text-primary-400">{icon}</div>}
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
