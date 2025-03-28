import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiX,
  FiDownload,
  FiStar,
  FiClock,
  FiCode,
  FiZap,
  FiShield,
  FiTag,
  FiSettings,
  FiCpu,
  FiServer,
  FiCheck,
  FiTrendingUp,
  FiPlayCircle,
  FiInfo
} from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptCard } from '../scripts/ScriptCard';
import { OSType } from '../../mocks/scripts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
};

const sidebarVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }
  }
};

// Featured Result Component
const FeaturedResult = ({ script }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md overflow-hidden mb-6 relative search-results-verified">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary-dark"></div>
      <div className="absolute top-4 right-4 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-light text-xs font-medium px-2.5 py-0.5 rounded-full">
        Featured Script
      </div>
      <div className="p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {script.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {script.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {script.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <FiDownload className="text-primary" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {script.downloads.toLocaleString()} downloads
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiStar className="text-yellow-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {script.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Updated {new Date(script.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/scripts/${script.id}`}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
            >
              View Script
            </Link>
            <button
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              <FiPlayCircle className="mr-1.5" />
              Quick Test
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-terminal-bg text-terminal-text rounded-lg overflow-hidden h-full">
            <div className="flex items-center p-2 bg-black bg-opacity-20">
              <div className="flex gap-1.5 ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-3 text-xs text-gray-400">
                {script.title.toLowerCase().replace(/\s+/g, '-')}.sh
              </div>
            </div>
            <pre className="p-4 text-sm overflow-auto h-48 terminal-scrollbar">
              <code>
                {script.code.substring(0, 400)}... 
                <span className="text-gray-400"># View complete script for full implementation</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 py-3 px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm">
              <FiCpu className="text-gray-400" />
              <span className="capitalize">
                {script.os === 'cross-platform' ? 'Cross-Platform' : script.os}
              </span>
            </span>
            <span className="flex items-center gap-1 text-sm">
              <FiTag className="text-gray-400" />
              <span className="capitalize">
                {script.category.replace('-', ' ')}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
            <FiCheck className="w-4 h-4" />
            <span>Verified &amp; Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sponsored Result Component
const SponsoredResult = ({ script }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="relative performance-card"
    >
      <div className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full z-10">
        Sponsored
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full script-card">
        <div className="p-5">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
            {script.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {script.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {script.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-0.5 bg-primary/5 dark:bg-primary-dark/10 rounded-full text-xs text-primary dark:text-primary-light"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <FiStar className="text-yellow-500 w-4 h-4" />
              <span className="text-sm font-medium">{script.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiDownload className="text-gray-400 w-4 h-4" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{script.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="capitalize text-xs font-medium text-gray-500 dark:text-gray-400">
                {script.os === 'cross-platform' ? '🔄 Cross-Platform' : 
                 script.os === 'linux' ? '🐧 Linux' :
                 script.os === 'windows' ? '🪟 Windows' : '🍎 macOS'}
              </span>
            </div>
            <Link 
              href={`/scripts/${script.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-full transition-colors"
            >
              View Script
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const EnhancedSearchResultsPage = () => {
  const router = useRouter();
  const { searchTerm, allScripts, setSearchTerm } = useScripts();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOS, setActiveOS] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get a featured script (first result or random)
  const getFeaturedScript = () => {
    if (results.length === 0) return null;
    return results[0]; // In a real implementation, this could be chosen based on quality score, sponsorship, etc.
  };
  
  // Get sponsored scripts (in a real implementation, this would come from a sponsorship system)
  const getSponsoredScripts = () => {
    if (results.length < 3) return [];
    // Simulate sponsored results by taking script at index 2
    return [results[2]];
  };
  
  // Get organic results (excluding featured and sponsored)
  const getOrganicResults = () => {
    if (results.length === 0) return [];
    const featured = getFeaturedScript();
    const sponsored = getSponsoredScripts();
    
    // Filter out the featured and sponsored scripts
    return results.filter(script => 
      script.id !== featured?.id && 
      !sponsored.some(s => s.id === script.id)
    );
  };
  
  // Extract unique categories from results
  const getCategories = () => {
    const categories = new Set();
    results.forEach(script => {
      categories.add(script.category);
    });
    return Array.from(categories);
  };
  
  // Search and filter logic
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      
      // Filter scripts based on search term
      let filteredResults = allScripts.filter(script =>
        script.title.toLowerCase().includes(term) ||
        script.description.toLowerCase().includes(term) ||
        script.tags.some(tag => tag.toLowerCase().includes(term)) ||
        script.category.toLowerCase().includes(term) ||
        script.os.toLowerCase().includes(term)
      );
      
      // Apply OS filter
      if (activeOS !== 'all') {
        filteredResults = filteredResults.filter(script =>
          script.os === activeOS || (activeOS === 'linux' && script.os === 'cross-platform')
        );
      }
      
      // Apply category filter
      if (activeCategory !== 'all') {
        filteredResults = filteredResults.filter(script => 
          script.category === activeCategory
        );
      }
      
      // Apply sorting
      filteredResults.sort((a, b) => {
        switch (sortOption) {
          case 'downloads':
            return b.downloads - a.downloads;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          case 'relevance':
          default:
            // Prioritize title matches
            const aTitle = a.title.toLowerCase().includes(term);
            const bTitle = b.title.toLowerCase().includes(term);
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            
            // Then tag matches
            const aTags = a.tags.some(tag => tag.toLowerCase().includes(term));
            const bTags = b.tags.some(tag => tag.toLowerCase().includes(term));
            if (aTags && !bTags) return -1;
            if (!aTags && bTags) return 1;
            
            // Then by downloads
            return b.downloads - a.downloads;
        }
      });
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, activeOS, activeCategory, sortOption, allScripts]);
  
  // Handle filter changes
  const handleOSFilter = (os) => setActiveOS(os);
  const handleCategoryFilter = (category) => setActiveCategory(category);
  const handleSortChange = (option) => setSortOption(option);
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    router.push('/');
  };
  
  // Toggle mobile filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Get search result summary text
  const getSearchSummary = () => {
    if (results.length === 0) return 'No results found';
    let summary = `${results.length} script${results.length !== 1 ? 's' : ''}`;
    if (activeOS !== 'all') summary += ` for ${activeOS}`;
    if (activeCategory !== 'all') summary += ` in ${activeCategory.replace('-', ' ')}`;
    return summary;
  };
  
  // Main render
  if (!searchTerm) return null;
  
  const featuredScript = getFeaturedScript();
  const sponsoredScripts = getSponsoredScripts();
  const organicResults = getOrganicResults();
  const categories = getCategories();
  const hasResults = results.length > 0;
  
  return (
    <section className="py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4">
        {/* Header with search info and controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center text-xl font-semibold text-gray-900 dark:text-white mb-1">
                <FiSearch className="text-primary dark:text-primary-light mr-2" />
                <h1>Results for "{searchTerm}"</h1>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getSearchSummary()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFilters}
                className="md:hidden inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <FiFilter className="mr-1.5" />
                Filters
              </button>
              <button
                onClick={clearSearch}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <FiX className="mr-1.5" />
                Clear
              </button>
            </div>
          </div>
          
          {/* Mobile filters (shown/hidden based on state) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  {/* OS Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operating System</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleOSFilter('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          activeOS === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        All Systems
                      </button>
                      <button
                        onClick={() => handleOSFilter('linux')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          activeOS === 'linux'
                            ? 'bg-linux-green text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🐧 Linux
                      </button>
                      <button
                        onClick={() => handleOSFilter('windows')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          activeOS === 'windows'
                            ? 'bg-windows-blue text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🪟 Windows
                      </button>
                      <button
                        onClick={() => handleOSFilter('macos')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          activeOS === 'macos'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🍎 macOS
                      </button>
                      <button
                        onClick={() => handleOSFilter('cross-platform')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          activeOS === 'cross-platform'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        🔄 Cross-Platform
                      </button>
                    </div>
                  </div>
                  
                  {/* Categories Filter */}
                  {categories.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCategoryFilter('all')}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                            activeCategory === 'all'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleCategoryFilter(category)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                              activeCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {category.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Sort Options */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSortChange('relevance')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          sortOption === 'relevance'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Relevance
                      </button>
                      <button
                        onClick={() => handleSortChange('downloads')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          sortOption === 'downloads'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Most Downloads
                      </button>
                      <button
                        onClick={() => handleSortChange('rating')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          sortOption === 'rating'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Highest Rated
                      </button>
                      <button
                        onClick={() => handleSortChange('newest')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                          sortOption === 'newest'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Newest First
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters (desktop) */}
          <motion.div
            className="hidden lg:block w-64 flex-shrink-0"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <FiFilter className="text-primary dark:text-primary-light mr-2" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
                </div>
              </div>
              
              {/* OS Filter */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Operating System</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleOSFilter('all')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      activeOS === 'all'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiServer className="mr-2" />
                    <span>All Systems</span>
                  </button>
                  <button
                    onClick={() => handleOSFilter('linux')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      activeOS === 'linux'
                        ? 'bg-linux-green/10 text-linux-green'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">🐧</span>
                    <span>Linux</span>
                  </button>
                  <button
                    onClick={() => handleOSFilter('windows')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      activeOS === 'windows'
                        ? 'bg-windows-blue/10 text-windows-blue'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">🪟</span>
                    <span>Windows</span>
                  </button>
                  <button
                    onClick={() => handleOSFilter('macos')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      activeOS === 'macos'
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">🍎</span>
                    <span>macOS</span>
                  </button>
                  <button
                    onClick={() => handleOSFilter('cross-platform')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      activeOS === 'cross-platform'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">🔄</span>
                    <span>Cross-Platform</span>
                  </button>
                </div>
              </div>
              
              {/* Categories Filter */}
              {categories.length > 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryFilter('all')}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                        activeCategory === 'all'
                          ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <FiTag className="mr-2" />
                      <span>All Categories</span>
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                          activeCategory === category
                            ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="mr-2">
                          {category === 'security' && <FiShield />}
                          {category === 'network' && <FiZap />}
                          {category === 'system-admin' && <FiCode />}
                          {!['security', 'network', 'system-admin'].includes(category) && <FiTag />}
                        </span>
                        <span className="capitalize">{category.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sort Options */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSortChange('relevance')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      sortOption === 'relevance'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiSearch className="mr-2" />
                    <span>Relevance</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('downloads')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      sortOption === 'downloads'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiDownload className="mr-2" />
                    <span>Most Downloads</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('rating')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      sortOption === 'rating'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiStar className="mr-2" />
                    <span>Highest Rated</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('newest')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg filter-button ${
                      sortOption === 'newest'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FiClock className="mr-2" />
                    <span>Newest First</span>
                  </button>
                </div>
              </div>
              
              {/* Enterprise Features */}
              <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Enterprise Features</h3>
                  <FiInfo className="text-gray-400 w-4 h-4" />
                </div>
                <div className="space-y-2">
                  <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    <FiSettings className="mr-2" />
                    <span>Advanced Filters</span>
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    <FiTrendingUp className="mr-2" />
                    <span>Usage Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content Area */}
          <div className="flex-grow">
            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Finding the best scripts...</h3>
                <p className="text-gray-600 dark:text-gray-400">Searching across verified shell scripts</p>
              </div>
            )}
            
            {/* No Results State */}
            {!loading && results.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No scripts found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any scripts matching your search criteria. Try adjusting your filters or using different keywords.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setActiveOS('all');
                      setActiveCategory('all');
                      setSortOption('relevance');
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                  <Link href="/add-script" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Add New Script
                  </Link>
                </div>
              </div>
            )}
            
            {/* Results Content */}
            {!loading && hasResults && (
              <div>
                {/* Featured Script (Premium Placement) */}
                {featuredScript && <FeaturedResult script={featuredScript} />}
                
                {/* Organic Results */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {organicResults.slice(0, 2).map(script => (
                    <motion.div key={script.id} variants={itemVariants}>
                      <ScriptCard script={script} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Sponsored Results (after a few organic results) */}
                {sponsoredScripts.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sponsored Results</h2>
                      <div className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                        Ad
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sponsoredScripts.map(script => (
                        <SponsoredResult key={script.id} script={script} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Remaining Organic Results */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {organicResults.slice(2).map(script => (
                    <motion.div key={script.id} variants={itemVariants}>
                      <ScriptCard script={script} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
        
        {/* Call to Action for Enterprise (Monetization Opportunity) */}
        {!loading && hasResults && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-8 md:py-10 md:flex md:items-center md:justify-between">
              <div className="md:flex-1 mb-6 md:mb-0">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Enterprise Ready Script Management</h2>
                <p className="text-blue-100 md:text-lg">
                  Deploy and manage verified shell scripts across your organization with enterprise controls
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/enterprise" 
                  className="inline-flex items-center justify-center px-5 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Learn More
                </Link>
                <Link 
                  href="/enterprise/demo" 
                  className="inline-flex items-center justify-center px-5 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors border border-blue-500"
                >
                  Request Demo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedSearchResultsPage;