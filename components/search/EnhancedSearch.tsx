import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiSearch, FiX, FiTag, FiFolder, FiCpu } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { debouncedSearch, highlightMatch, groupResultsByCategory, useKeyboardNavigation } from '../../utils/searchUtils';

type EnhancedSearchProps = {
  className?: string;
  placeholder?: string;
  maxResults?: number;
  onSearch?: (term: string) => void;
};

export const EnhancedSearch = ({
  className = '',
  placeholder = 'Search for scripts, commands, or solutions...',
  maxResults = 10,
  onSearch
}: EnhancedSearchProps) => {
  const { allScripts, setSearchTerm } = useScripts();
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Perform search
  const performSearch = async (term: string) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return [];
    }

    const lowercaseTerm = term.toLowerCase();
    
    // Search through scripts
    const filteredResults = allScripts.filter(script => 
      script.title.toLowerCase().includes(lowercaseTerm) ||
      script.description.toLowerCase().includes(lowercaseTerm) ||
      script.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm)) ||
      script.category.toLowerCase().includes(lowercaseTerm) ||
      script.os.toLowerCase().includes(lowercaseTerm)
    ).slice(0, maxResults);
    
    return filteredResults;
  };

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsSearching(value.length > 0);
    
    // Show results as user types
    if (value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
    
    // Use debounced search
    debouncedSearch(value, (results) => {
      setSearchResults(results);
      setIsSearching(false);
    }, performSearch);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue) {
      setSearchTerm(inputValue);
      setShowResults(false);
      
      if (onSearch) {
        onSearch(inputValue);
      }
      
      // Redirect to homepage with search term
      router.push({
        pathname: '/',
        query: { search: inputValue }
      });
    }
  };

  // Clear search input
  const clearSearch = () => {
    setInputValue('');
    setSearchResults([]);
    setShowResults(false);
    setIsSearching(false);
    inputRef.current?.focus();
  };

  // Handle result selection
  const handleResultSelect = (scriptId: string) => {
    setShowResults(false);
    router.push(`/scripts/${scriptId}`);
  };

  // Setup keyboard navigation
  const handleKeyDown = useKeyboardNavigation(
    searchResults.length,
    showResults,
    setHighlightedIndex,
    highlightedIndex,
    (index) => handleResultSelect(searchResults[index].id),
    () => setShowResults(false)
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return <FiTag className="text-emergency-red" />;
      case 'networking':
        return <FiTag className="text-windows-blue" />;
      case 'monitoring':
        return <FiTag className="text-linux-green" />;
      default:
        return <FiFolder />;
    }
  };

  // Get OS icon
  const getOSIcon = (os: string) => {
    switch (os) {
      case 'linux':
        return '🐧';
      case 'windows':
        return '🪟';
      case 'macos':
        return '🍎';
      case 'cross-platform':
        return '🔄';
      default:
        return <FiCpu />;
    }
  };

  // Render highlighted text
  const renderHighlightedText = (text: string, searchTerm: string) => {
    const { parts } = highlightMatch(text, searchTerm);
    return (
      <>
        {parts.map((part, i) => (
          <span key={i} className={part.isMatch ? "bg-primary/20 text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light font-medium" : ""}>
            {part.text}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full py-2 pl-10 pr-10 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark transition-shadow search-input"
            value={inputValue}
            onChange={handleInputChange}
            aria-label="Search"
          />
          
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <FiSearch className="search-icon transition-transform" />
          </span>
          
          {inputValue && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FiX className="clear-search-icon" />
            </button>
          )}
        </div>
      </form>
      
      {/* Search Results Dropdown */}
      {showResults && (inputValue.length > 1) && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-[70vh] overflow-y-auto search-results-container">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="search-loading-indicator"></div>
              Searching...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found for "{inputValue}"
            </div>
          ) : (
            <div>
              <div className="p-2 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found for "{inputValue}"
              </div>
              
              <div className="py-2">
                {searchResults.map((script, index) => (
                  <div
                    key={script.id}
                    onClick={() => handleResultSelect(script.id)}
                    className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                      index === highlightedIndex ? 'bg-gray-50 dark:bg-gray-750 search-result-highlighted' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {renderHighlightedText(script.title, inputValue)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <span>{getOSIcon(script.os)}</span>
                        <span>{script.rating.toFixed(1)} ⭐</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mt-0.5">
                      {renderHighlightedText(script.description, inputValue)}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        {getCategoryIcon(script.category)}
                        <span className="capitalize">{script.category.replace('-', ' ')}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 text-xs">
                        {script.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                          >
                            {renderHighlightedText(tag, inputValue)}
                          </span>
                        ))}
                        {script.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                            +{script.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center">
                <button
                  onClick={handleSubmit}
                  className="text-sm text-primary dark:text-primary-light font-medium hover:underline"
                >
                  See all results for "{inputValue}"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;