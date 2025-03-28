import React from 'react';

type SearchErrorProps = {
  message?: string;
  onRetry?: () => void;
};

const SearchError: React.FC<SearchErrorProps> = ({ 
  message = "An error occurred with the search", 
  onRetry 
}) => {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
      <p className="text-sm text-red-600 dark:text-red-400 mb-2">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-xs font-medium text-primary dark:text-primary-light hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default SearchError;
