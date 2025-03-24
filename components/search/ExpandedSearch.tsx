import React from 'react';
import { EnhancedSearch } from './EnhancedSearch';

/**
 * ExpandedSearch - A full-featured search component for dedicated search pages
 * 
 * This component provides a richer search experience with filters, 
 * recent searches history, and expanded results display.
 * Ideal for dedicated search pages or advanced search interfaces.
 */
export const ExpandedSearch: React.FC = () => {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        Find the Perfect Script
      </h1>
      
      <EnhancedSearch 
        placeholder="Search scripts, commands, tools, or solutions..."
        maxResults={15}
        variant="expanded"
        showFilters={true}
        showRecentSearches={true}
        className="w-full max-w-3xl mx-auto"
      />
      
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Search across {/* This would be dynamic in a real implementation */}
          <span className="text-primary dark:text-primary-light font-medium">500+</span> scripts 
          for Linux, Windows, macOS, and cross-platform environments
        </p>
        <p className="mt-2">
          Can't find what you need? <a href="/add-script" className="text-primary dark:text-primary-light hover:underline">Contribute a script</a>
        </p>
      </div>
    </div>
  );
};

export default ExpandedSearch;