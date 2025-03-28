import React, { useEffect, useState } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptCard } from '../scripts/ScriptCard';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';

export const SearchResults = () => {
  const { searchTerm, allScripts } = useScripts();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Simple timeout to simulate search delay for better UX
    const timer = setTimeout(() => {
      const lowercaseTerm = searchTerm.toLowerCase();
      
      // Filter scripts based on search term
      const results = allScripts.filter(script => 
        script.title.toLowerCase().includes(lowercaseTerm) ||
        script.description.toLowerCase().includes(lowercaseTerm) ||
        script.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm)) ||
        script.category.toLowerCase().includes(lowercaseTerm) ||
        script.os.toLowerCase().includes(lowercaseTerm)
      );
      
      // Sort results by relevance
      results.sort((a, b) => {
        // Title match is highest priority
        const aTitle = a.title.toLowerCase().includes(lowercaseTerm);
        const bTitle = b.title.toLowerCase().includes(lowercaseTerm);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        
        // Tags match is second priority
        const aTags = a.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm));
        const bTags = b.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm));
        if (aTags && !bTags) return -1;
        if (!aTags && bTags) return 1;
        
        // Then sort by downloads
        return b.downloads - a.downloads;
      });
      
      setSearchResults(results);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, allScripts]);

  if (!searchTerm) {
    return null;
  }

  return (
    <section id="search-results-section" className="container mx-auto px-4 py-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <FiSearch className="text-primary dark:text-primary-light mr-2" />
            <h2 className="text-lg font-semibold">
              Search Results for "{searchTerm}"
            </h2>
          </div>
          <Link href="/" shallow className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiX />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-primary-light rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400">Searching scripts...</p>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <div className="p-4">
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Found {searchResults.length} script{searchResults.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(script => (
                    <ScriptCard key={script.id} script={script} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No scripts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                  We couldn't find any scripts matching your search term. Try using different keywords or browse our categories.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/categories" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Browse Categories
                  </Link>
                  <Link href="/add-script" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-medium transition-colors">
                    Add New Script
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchResults;