import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiFilter, FiGrid, FiList, FiChevronRight } from 'react-icons/fi';
import { Layout } from '../../components/layout/Layout';
import { EnhancedSearch } from '../../components/search/EnhancedSearch';
import { useScripts } from '../../context/ScriptsContext';
import { categories } from '../../mocks/scripts';
import { motion } from 'framer-motion';

// Define TypeScript types for our data
type CategoryTag = string;
type CategoryItemProps = {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  popularTags: CategoryTag[];
};

// Animation variants for fade-in effects
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.1, 0.6, 0.3, 1]
    }
  })
};

// Category Card Component
const CategoryCard: React.FC<{ 
  category: CategoryItemProps; 
  index: number;
  viewMode: 'grid' | 'list';
}> = ({ category, index, viewMode }) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex ${
        viewMode === 'list' ? 'flex-row' : 'flex-col'
      }`}
    >
      <div className={`p-5 ${viewMode === 'list' ? 'w-1/3 border-r border-gray-100 dark:border-gray-700 flex items-center justify-center' : 'border-b border-gray-100 dark:border-gray-700'}`}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl mb-3">
            {category.icon}
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white text-center">
            {category.name}
          </h3>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {category.count} scripts
          </div>
        </div>
      </div>
      
      <div className={`${viewMode === 'list' ? 'w-2/3 p-5' : 'p-5'} flex-grow`}>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {category.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {category.popularTags.map((tag) => (
            <span 
              key={tag}
              className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          href={`/categories/${category.id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Browse Scripts <FiChevronRight className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};

// Terminal Card Component for Featured Category
const TerminalFeaturedCategory = () => {
  // Get the security category as our featured category
  const securityCategory = categories.find(c => c.id === 'security');
  
  if (!securityCategory) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-terminal-bg text-terminal-text rounded-lg shadow-md overflow-hidden mb-8 border border-gray-700"
    >
      <div className="terminal-header flex items-center justify-between p-2">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-3 text-xs text-gray-400">
          featured_category.sh
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center text-2xl">
            {securityCategory.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {securityCategory.name}
            </h3>
            <div className="text-sm text-gray-400">Featured Category</div>
          </div>
        </div>
        
        <div className="mb-4 font-mono">
          <div className="text-terminal-green mb-1">$ ls -la security/</div>
          <div className="mb-1">total {securityCategory.count}</div>
          <div className="mb-1">drwxr-xr-x 2 user group 4096 Mar 24 2025 .</div>
          <div className="mb-1">drwxr-xr-x 15 user group 4096 Mar 24 2025 ..</div>
          <div className="mb-1 text-blue-400">-rwxr--r-- 1 user group 4.2K Mar 24 2025 firewall_config.sh</div>
          <div className="mb-1 text-blue-400">-rwxr--r-- 1 user group 3.8K Mar 23 2025 intrusion_detection.sh</div>
          <div className="mb-1 text-blue-400">-rwxr--r-- 1 user group 2.5K Mar 22 2025 security_audit.sh</div>
          <div className="text-terminal-green">$ _</div>
        </div>
        
        <p className="text-sm mb-4">
          {securityCategory.description}
        </p>
        
        <Link 
          href={`/categories/${securityCategory.id}`}
          className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors"
        >
          Explore Security Scripts
        </Link>
      </div>
    </motion.div>
  );
};

// Main Categories Page Component
export default function CategoriesPage() {
  const { isLoading } = useScripts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.popularTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredCategories(filtered);
  }, [searchTerm]);
  
  // Event handler for search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout title="Browse Categories | Sp1sh" description="Explore script categories organized by functionality, purpose, and use cases.">
      <Head>
        <meta name="keywords" content="shell scripts, categories, system administration, security, networking, monitoring" />
      </Head>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Script Categories
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Browse our organized collection of shell scripts for different use cases and scenarios.
              Find exactly what you need for your system administration tasks.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full py-3 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  <FiSearch />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        {/* Featured Category Section */}
        <TerminalFeaturedCategory />
        
        {/* Categories Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All Categories
            </h2>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We couldn't find any categories matching your search. Try different keywords or browse all categories.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors"
              >
                Show All Categories
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredCategories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Specialized Categories Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Specialized Solutions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Scripts Box */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-emergency-red/10 to-emergency-red/5 rounded-lg border-l-4 border-emergency-red p-6 flex flex-col"
            >
              <div className="text-emergency-red text-xl mb-3">🚨</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Emergency Scripts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Critical recovery, security response, and system diagnostic scripts for urgent situations.
              </p>
              <Link
                href="/emergency"
                className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-emergency-red border border-emergency-red/30 rounded-full text-sm font-medium hover:bg-emergency-red/10 transition-colors"
              >
                View Emergency Scripts
              </Link>
            </motion.div>
            
            {/* Cross-Platform Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-r from-purple-100/50 to-purple-50/50 dark:from-purple-900/30 dark:to-purple-900/10 rounded-lg border-l-4 border-purple-400 dark:border-purple-600 p-6 flex flex-col"
            >
              <div className="text-purple-600 dark:text-purple-400 text-xl mb-3">🔄</div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Cross-Platform Scripts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Scripts that work across multiple operating systems with minimal adaptation.
              </p>
              <Link
                href="/os/cross-platform"
                className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-400/30 dark:border-purple-600/30 rounded-full text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                View Cross-Platform Scripts
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* OS-Specific Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Operating System Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Linux */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm p-6"
            >
              <div className="w-12 h-12 bg-linux-green/10 rounded-full flex items-center justify-center text-2xl mb-4">
                🐧
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Linux Scripts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Powerful shell scripts for Debian, Ubuntu, CentOS, RHEL and other Linux distributions.
              </p>
              <Link
                href="/os/linux"
                className="inline-flex items-center text-linux-green hover:underline"
              >
                Browse Linux Scripts <FiChevronRight className="ml-1" />
              </Link>
            </motion.div>
            
            {/* Windows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm p-6"
            >
              <div className="w-12 h-12 bg-windows-blue/10 rounded-full flex items-center justify-center text-2xl mb-4">
                🪟
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                Windows Scripts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                PowerShell and batch scripts for Windows Server and desktop environments.
              </p>
              <Link
                href="/os/windows"
                className="inline-flex items-center text-windows-blue hover:underline"
              >
                Browse Windows Scripts <FiChevronRight className="ml-1" />
              </Link>
            </motion.div>
            
            {/* macOS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm p-6"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl mb-4">
                🍎
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                macOS Scripts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Shell scripts optimized for macOS environments and administration.
              </p>
              <Link
                href="/os/macos"
                className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:underline"
              >
                Browse macOS Scripts <FiChevronRight className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Contributing Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20 mb-10"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Missing a Category?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We're constantly expanding our script collection. If you have scripts for a category that's not listed here, 
                consider contributing to our repository and help the community.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <Link
                href="/add-script"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors"
              >
                Contribute a Script
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}