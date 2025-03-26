import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronRight, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { useNavigation } from '../../context/NavigationContext';
import { ScriptCard } from '../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';
import { filterScriptsByCategory } from '../../utils/categories/categoryUtils';
import { CategoryItem, OperatingSystem } from '../../types/categories';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const CategorySlugPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { allScripts, isLoading } = useScripts();
  const { getBreadcrumbs, findCategoryByPath } = useNavigation();
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(null);
  const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOS, setFilterOS] = useState<OperatingSystem>('all');
  const [expandedInfo, setExpandedInfo] = useState(false);

  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      const fullPath = `/categories/${slug.join('/')}`;
      
      // Try to find the category in the navigation structure
      const category = findCategoryByPath(fullPath);
      setCurrentCategory(category);
      
      // Filter scripts based on category
      let categoryScripts = filterScriptsByCategory(allScripts, fullPath);
      
      // Apply OS filter if needed
      if (filterOS !== 'all') {
        categoryScripts = categoryScripts.filter(script => 
          script.os === filterOS || script.os === 'cross-platform'
        );
      }
      
      setFilteredScripts(categoryScripts);
    }
  }, [slug, allScripts, filterOS, findCategoryByPath]);
  
  if (isLoading || !slug) {
    return <LoadingPlaceholder />;
  }
  
  const fullPath = `/categories/${Array.isArray(slug) ? slug.join('/') : slug}`;
  const breadcrumbs = getBreadcrumbs(fullPath);
  
  // Get category information, falling back to slug-based formatting if needed
  const categoryName = currentCategory?.name || slug[slug.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const categoryDescription = currentCategory?.description || 
    `Find the best ${categoryName.toLowerCase()} scripts for system administration and automation.`;
  
  const categoryIcon = currentCategory?.icon;

  return (
    <>
      <Head>
        <title>{categoryName} Scripts | Sp1sh</title>
        <meta name="description" content={categoryDescription} />
        <meta name="keywords" content={`shell scripts, ${categoryName.toLowerCase()}, automation, system administration`} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <FiChevronRight className="mx-2 mt-0.5" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-medium">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary dark:hover:text-primary-light">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
        
        {/* Category Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start">
            {categoryIcon && (
              <div className="mr-4 text-4xl">
                {categoryIcon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {categoryName} Scripts
              </h1>
              <p className={`text-gray-600 dark:text-gray-300 ${!expandedInfo && 'line-clamp-2'}`}>
                {categoryDescription}
                {expandedInfo && currentCategory?.children && currentCategory.children.length > 0 && (
                  <>
                    <br /><br />
                    This category contains {filteredScripts.length} scripts and {currentCategory.children.length} subcategories.
                    Browse the available scripts below or explore subcategories for more specific solutions.
                  </>
                )}
              </p>
              {categoryDescription.length > 100 && (
                <button 
                  onClick={() => setExpandedInfo(!expandedInfo)}
                  className="text-primary dark:text-primary-light text-sm font-medium flex items-center mt-2"
                >
                  {expandedInfo ? 'Show less' : 'Show more'}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`ml-1 w-4 h-4 transform transition-transform ${expandedInfo ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Subcategories Section */}
        {currentCategory?.children && currentCategory.children.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Subcategories
            </h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentCategory.children.map((subcategory, index) => (
                <motion.div
                  key={subcategory.path}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    href={subcategory.path}
                    className="flex items-start p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {subcategory.icon ? (
                      <span className="text-2xl mr-3">{subcategory.icon}</span>
                    ) : (
                      <svg 
                        className="w-6 h-6 mr-3 text-primary dark:text-primary-light" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {subcategory.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Explore {subcategory.name.toLowerCase()} scripts
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
        
        {/* Scripts Section */}
        <section>
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Scripts {filteredScripts.length > 0 && `(${filteredScripts.length})`}
            </h2>
            
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              {/* OS Filter Buttons */}
              <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setFilterOS('all')}
                  className={`px-3 py-1 text-xs rounded-md ${
                    filterOS === 'all' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All OS
                </button>
                <button
                  onClick={() => setFilterOS('linux')}
                  className={`px-3 py-1 text-xs rounded-md flex items-center ${
                    filterOS === 'linux' 
                      ? 'bg-linux-green/90 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">🐧</span> Linux
                </button>
                <button
                  onClick={() => setFilterOS('windows')}
                  className={`px-3 py-1 text-xs rounded-md flex items-center ${
                    filterOS === 'windows' 
                      ? 'bg-windows-blue/90 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">🪟</span> Windows
                </button>
                <button
                  onClick={() => setFilterOS('macos')}
                  className={`px-3 py-1 text-xs rounded-md flex items-center ${
                    filterOS === 'macos' 
                      ? 'bg-gray-800/90 dark:bg-gray-600 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">🍎</span> macOS
                </button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {filteredScripts.length > 0 ? (
            <motion.div 
              className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredScripts.map((script) => (
                <motion.div key={script.id} variants={itemVariants}>
                  <ScriptCard script={script} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scripts found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {filterOS !== 'all' 
                  ? `No ${filterOS} scripts found in this category. Try selecting a different OS or check back later.`
                  : 'No scripts found in this category yet. Check back later or explore other categories.'}
              </p>
              {filterOS !== 'all' ? (
                <button
                  onClick={() => setFilterOS('all')}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
                >
                  Show All OS
                </button>
              ) : (
                <Link
                  href="/categories"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors inline-block"
                >
                  Browse All Categories
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default CategorySlugPage;
