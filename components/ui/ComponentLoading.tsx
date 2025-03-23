import React from 'react';

interface ComponentLoadingProps {
  height?: string;
}

export const ComponentLoading: React.FC<ComponentLoadingProps> = ({ height = '12rem' }) => {
  return (
    <div 
      className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
      style={{ height }}
    >
      <div className="flex items-center justify-center h-full">
        <svg className="w-8 h-8 text-gray-300 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  );
};

export default ComponentLoading;
