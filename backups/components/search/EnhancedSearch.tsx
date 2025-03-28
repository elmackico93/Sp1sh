import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiTag, FiFolder, FiCpu, 
         FiClock, FiStar, FiDownload, FiChevronRight } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { debouncedSearch, highlightMatch, useKeyboardNavigation } from '../../utils/searchUtils';

type EnhancedSearchProps = {
  className?: string;
  placeholder?: string;
  maxResults?: number;
  onSearch?: (term: string) => void;
  showFilters?: boolean;
  showRecentSearches?: boolean;
  variant?: 'default' | 'compact' | 'expanded';
};

export const EnhancedSearch = ({
  className = '',
  placeholder = 'Search for scripts, commands, or solutions...',
  maxResults = 10,
  onSearch,
  showFilters = false,
  showRecentSearches = false,
  variant = 'default'
}: EnhancedSearchProps) => {
  const { allScripts, setSearchTerm } = useScripts();
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (showRecentSearches) {
      try {
        const storedSearches = localStorage.getItem('sp1sh_recent_searches');
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, [showRecentSearches]);

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

  // Save search term to recent searches
  const saveToRecentSearches = (term: string) => {
    if (!showRecentSearches || term.trim().length < 2) return;
    
    try {
      const updatedSearches = [
        term,
        ...recentSearches.filter(s => s !== term)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('sp1sh_recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // Filter scripts based on active filter
  const filterScripts = (scripts: any[]) => {
    if (activeFilter === 'all') return scripts;
    
    return scripts.filter(script => {
      switch (activeFilter) {
        case 'linux':
          return script.os === 'linux' || script.os === 'cross-platform';
        case 'windows':
          return script.os === 'windows' || script.os === 'cross-platform';
        case 'macos':
          return script.os === 'macos' || script.os === 'cross-platform';
        case 'security':
          return script.category === 'security';
        case 'emergency':
          return script.category === 'emergency' || script.emergencyLevel !== undefined;
        default:
          return true;
      }
    });
  };

  // Perform search
  const performSearch = async (term: string) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return [];
    }

    const lowercaseTerm = term.toLowerCase();
    
    // Search through scripts
    let filteredResults = allScripts.filter(script => 
      script.title.toLowerCase().includes(lowercaseTerm) ||
      script.description.toLowerCase().includes(lowercaseTerm) ||
      script.tags.some(tag => tag.toLowerCase().includes(lowercaseTerm)) ||
      script.category.toLowerCase().includes(lowercaseTerm) ||
      script.os.toLowerCase().includes(lowercaseTerm)
    );
    
    // Apply active filter
    filteredResults = filterScripts(filteredResults);
    
    // Sort results by relevance
    filteredResults.sort((a, b) => {
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
    
    return filteredResults.slice(0, maxResults);
  };

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsSearching(value.length > 0);
    
    // Reset highlighted index when input changes
    setHighlightedIndex(-1);
    
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
      saveToRecentSearches(inputValue);
      
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

  // Use recent search
  const handleUseRecentSearch = (term: string) => {
    setInputValue(term);
    setSearchTerm(term);
    setShowResults(false);
    
    if (onSearch) {
      onSearch(term);
    }
    
    // Redirect to homepage with search term
    router.push({
      pathname: '/',
      query: { search: term }
    });
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
    saveToRecentSearches(inputValue);
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

  // Scroll to highlighted item
  useEffect(() => {
    if (highlightedIndex >= 0 && resultsRef.current) {
      const highlightedElement = resultsRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

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

  // Filter options
  const filterOptions = useMemo(() => [
    { id: 'all', label: 'All', icon: '🔍' },
    { id: 'linux', label: 'Linux', icon: '🐧' },
    { id: 'windows', label: 'Windows', icon: '🪟' },
    { id: 'macos', label: 'macOS', icon: '🍎' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' },
  ], []);

  // Animation variants
  const resultsVariants = {
    hidden: { opacity: 0, y: -10, scaleY: 0.95, transformOrigin: "top center" },
    visible: { 
      opacity: 1, 
      y: 0, 
      scaleY: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scaleY: 0.95,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={`w-full py-2 pl-10 pr-10 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark transition-shadow search-input ${
              variant === 'expanded' ? 'py-3 text-base' : variant === 'compact' ? 'py-1.5 text-xs' : ''
            }`}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue.length > 1 && setShowResults(true)}
            aria-label="Search"
            autoComplete="off"
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
        
        {/* Filter options - only show when expanded variant is selected */}
        {showFilters && variant === 'expanded' && (
          <div className="flex mt-2 space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterOptions.map(filter => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center px-3 py-1 rounded-full text-xs transition-colors ${
                  activeFilter === filter.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        )}
      </form>
      
      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (inputValue.length > 1) && (
          <motion.div
            ref={resultsRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={resultsVariants}
            className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 max-h-[70vh] overflow-y-auto search-results-container"
          >
            {isSearching ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="search-loading-indicator"></div>
                <span className="text-sm">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center">
                <div className="mb-2 text-gray-400 dark:text-gray-500">
                  <FiSearch className="w-6 h-6 mx-auto" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No results found for <strong>"{inputValue}"</strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try different keywords or check for typos
                </p>
                
                {/* Recent searches */}
                {showRecentSearches && recentSearches.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Recent searches
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {recentSearches.map(term => (
                        <button
                          key={term}
                          onClick={() => handleUseRecentSearch(term)}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="p-2 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <span>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found for "{inputValue}"</span>
                  {showFilters && (
                    <div className="flex items-center gap-1">
                      <span>Filter:</span>
                      <select 
                        className="text-xs bg-transparent border-none p-0 pr-4 appearance-none cursor-pointer"
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                      >
                        {filterOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="py-1">
                  {searchResults.map((script, index) => (
                    <div
                      key={script.id}
                      data-index={index}
                      onClick={() => handleResultSelect(script.id)}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors ${
                        index === highlightedIndex ? 'bg-gray-50 dark:bg-gray-750 search-result-highlighted' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {renderHighlightedText(script.title, inputValue)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                          <span>{getOSIcon(script.os)}</span>
                          <span className="flex items-center gap-0.5">
                            <FiStar className="text-yellow-500" />
                            {script.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mt-0.5">
                        {renderHighlightedText(script.description, inputValue)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
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
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <FiDownload className="w-3 h-3" />
                            {script.downloads.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <FiClock className="w-3 h-3" />
                            {new Date(script.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-center">
                  <button
                    onClick={handleSubmit}
                    className="group text-sm text-primary dark:text-primary-light font-medium hover:underline inline-flex items-center"
                  >
                    See all results for "{inputValue}"
                    <FiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recent searches - only show when 'expanded' variant is selected and no results are shown */}
      {showRecentSearches && variant === 'expanded' && !showResults && recentSearches.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(term => (
              <button
                key={term}
                onClick={() => handleUseRecentSearch(term)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <FiClock className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                {term}
              </button>
            ))}
            <button
              onClick={() => {
                setRecentSearches([]);
                localStorage.removeItem('sp1sh_recent_searches');
              }}
              className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;