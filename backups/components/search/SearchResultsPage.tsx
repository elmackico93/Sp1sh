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
  FiTag
} from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptCard } from '../scripts/ScriptCard';
import { OSType } from '../../mocks/scripts';

// Animation variants for results and filters
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }
  }
};

export const SearchResultsPage = () => {
  const { searchTerm, allScripts, setSearchTerm } = useScripts();
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOS, setActiveOS] = useState<OSType | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('relevance');
  const router = useRouter();

  // Handle filter changes
  const handleOSFilter = (os: OSType | 'all') => setActiveOS(os);
  const handleCategoryFilter = (category: string) => setActiveCategory(category);
  const handleSortChange = (option: string) => setSortOption(option);
  const clearSearch = () => {
    setSearchTerm('');
    router.push('/');
  };

  // Estrarre le categorie dai risultati (dinamicamente)
  const getCategories = () => {
    const categories = new Set<string>();
    filteredResults.forEach(script => {
      categories.add(script.category);
    });
    return Array.from(categories);
  };

  // Inizializza la ricerca in base al searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setFilteredResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const results = allScripts.filter(script =>
        script.title.toLowerCase().includes(term) ||
        script.description.toLowerCase().includes(term) ||
        script.tags.some((tag: string) => tag.toLowerCase().includes(term)) ||
        script.category.toLowerCase().includes(term) ||
        script.os.toLowerCase().includes(term)
      );
      setFilteredResults(results);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm, allScripts]);

  // Applica filtri (OS e categoria) e ordinamento
  useEffect(() => {
    if (filteredResults.length === 0) return;
    let results = [...filteredResults];
    if (activeOS !== 'all') {
      results = results.filter(script =>
        script.os === activeOS || (activeOS === 'linux' && script.os === 'cross-platform')
      );
    }
    if (activeCategory !== 'all') {
      results = results.filter(script => script.category === activeCategory);
    }
    results.sort((a, b) => {
      switch (sortOption) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'relevance':
        default:
          const aTitle = a.title.toLowerCase().includes(searchTerm.toLowerCase());
          const bTitle = b.title.toLowerCase().includes(searchTerm.toLowerCase());
          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;
          const aTags = a.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          const bTags = b.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          if (aTags && !bTags) return -1;
          if (!aTags && bTags) return 1;
          return b.downloads - a.downloads;
      }
    });
    setFilteredResults(results);
  }, [activeOS, activeCategory, sortOption, searchTerm]);

  const getSearchSummary = () => {
    if (filteredResults.length === 0) return 'No results found';
    let summary = `${filteredResults.length} script${filteredResults.length !== 1 ? 's' : ''}`;
    if (activeOS !== 'all') summary += ` for ${activeOS}`;
    if (activeCategory !== 'all') summary += ` in ${activeCategory.replace('-', ' ')}`;
    return summary;
  };

  const hasResults = filteredResults.length > 0;
  const categories = getCategories();

  if (!searchTerm) return null;

  return (
    <section id="search-results-page" className="pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            className="w-full lg:w-64 shrink-0"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <FiFilter className="text-primary dark:text-primary-light mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                </div>
              </div>
              {/* OS Filter */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Operating System</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleOSFilter('all')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      activeOS === 'all'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">💻</span>
                    <span>All Systems</span>
                  </button>
                  <button
                    onClick={() => handleOSFilter('linux')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
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
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
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
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
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
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
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
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryFilter('all')}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                        activeCategory === 'all'
                          ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">📂</span>
                      <span>All Categories</span>
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSortChange('relevance')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      sortOption === 'relevance'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">✨</span>
                    <span>Relevance</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('downloads')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      sortOption === 'downloads'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2"><FiDownload /></span>
                    <span>Most Downloads</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('rating')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      sortOption === 'rating'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2"><FiStar /></span>
                    <span>Highest Rated</span>
                  </button>
                  <button
                    onClick={() => handleSortChange('newest')}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      sortOption === 'newest'
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2"><FiClock /></span>
                    <span>Newest First</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Results Content */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    <FiSearch className="text-primary dark:text-primary-light mr-2" />
                    <h2>Results for "{searchTerm}"</h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{getSearchSummary()}</p>
                </div>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiX className="mr-1" />
                  Clear Search
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Searching...</h3>
                <p className="text-gray-600 dark:text-gray-400">Finding the best matches for you</p>
              </div>
            )}

            {/* No Results */}
            {!loading && filteredResults.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No scripts found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any scripts matching your search criteria. Try adjusting your filters or using different keywords.
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

            {/* Results Grid */}
            {!loading && hasResults && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredResults.map(script => (
                  <motion.div key={script.id} variants={itemVariants}>
                    <ScriptCard script={script} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchResultsPage;
