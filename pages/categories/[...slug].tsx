import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronRight, FiFolder, FiList, FiGrid, FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptCard } from '../../components/scripts/ScriptCard';
import { Script, mockScripts, OSType } from '../../mocks/scripts';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';
import { navigationMenu } from '../../components/layout/EnhancedNavbar';

// Import the navigation menu structure from EnhancedNavbar
// This is a dummy import since we don't want to modify the actual file structure
// In a real implementation, you'd properly export the navigation structure

// Helper interfaces for types
interface CategoryItem {
  name: string;
  path: string;
  icon?: string;
  description?: string;
}

interface CategoryData {
  title: string;
  description: string;
  breadcrumbs: { name: string; path: string }[];
  subcategories: CategoryItem[];
  scripts: Script[];
  parentCategory?: CategoryItem;
  iconEmoji?: string;
}

// Function to find a category in the navigation structure
const findCategoryInNavigation = (
  slug: string[],
  navigationItems = navigationMenu
): CategoryData | null => {
  // Convert slug to path format
  const fullPath = `/categories/${slug.join('/')}`;
  
  // Search first level
  const firstLevelItem = navigationItems.find(
    item => item.path === fullPath || 
           (item.path.startsWith('/categories/') && fullPath.startsWith(item.path))
  );
  
  if (!firstLevelItem) return null;
  
  // If exact match at first level
  if (firstLevelItem.path === fullPath) {
    return {
      title: firstLevelItem.name,
      description: `Find the best ${firstLevelItem.name.toLowerCase()} scripts for all platforms.`,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: firstLevelItem.name, path: firstLevelItem.path }
      ],
      subcategories: firstLevelItem.children.map(child => ({
        name: child.name,
        path: child.path,
        icon: child.icon
      })),
      scripts: mockScripts.filter(script => 
        script.category.toLowerCase() === slug[0].toLowerCase()
      ),
      iconEmoji: firstLevelItem.icon
    };
  }
  
  // Search second level
  for (const firstLevel of navigationItems) {
    const secondLevelItem = firstLevel.children?.find(
      item => item.path === fullPath || 
             (item.path.startsWith('/categories/') && fullPath.startsWith(item.path))
    );
    
    if (secondLevelItem) {
      // If exact match at second level
      if (secondLevelItem.path === fullPath) {
        return {
          title: secondLevelItem.name,
          description: `Explore ${secondLevelItem.name.toLowerCase()} scripts and solutions.`,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: firstLevel.name, path: firstLevel.path },
            { name: secondLevelItem.name, path: secondLevelItem.path }
          ],
          subcategories: secondLevelItem.children?.map(child => ({
            name: child.name,
            path: child.path
          })) || [],
          scripts: mockScripts.filter(script => 
            script.category.toLowerCase() === slug[0].toLowerCase() &&
            script.title.toLowerCase().includes(secondLevelItem.name.toLowerCase())
          ),
          parentCategory: {
            name: firstLevel.name,
            path: firstLevel.path,
            icon: firstLevel.icon
          },
          iconEmoji: secondLevelItem.icon || firstLevel.icon
        };
      }
      
      // Search third level
      const thirdLevelItem = secondLevelItem.children?.find(
        item => item.path === fullPath
      );
      
      if (thirdLevelItem) {
        return {
          title: thirdLevelItem.name,
          description: `Ready-to-use ${thirdLevelItem.name.toLowerCase()} scripts for your needs.`,
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: firstLevel.name, path: firstLevel.path },
            { name: secondLevelItem.name, path: secondLevelItem.path },
            { name: thirdLevelItem.name, path: thirdLevelItem.path }
          ],
          subcategories: [],
          scripts: mockScripts.filter(script => 
            script.category.toLowerCase() === slug[0].toLowerCase() &&
            script.title.toLowerCase().includes(thirdLevelItem.name.toLowerCase())
          ),
          parentCategory: {
            name: secondLevelItem.name,
            path: secondLevelItem.path,
            icon: secondLevelItem.icon
          },
          iconEmoji: firstLevel.icon
        };
      }
    }
  }
  
  return null;
};

const DynamicCategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { allScripts, isLoading } = useScripts();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOS, setFilterOS] = useState<OSType | 'all'>('all');
  const [expandedInfo, setExpandedInfo] = useState(false);
  
  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      // Find category in navigation structure
      const data = findCategoryInNavigation(slug);
      setCategoryData(data);
      
      // If data is null or couldn't be found, redirect to 404
      if (!data && !isLoading) {
        router.push('/404');
      }
    }
  }, [slug, router, isLoading]);
  
  // Loading state
  if (isLoading || !categoryData) {
    return <LoadingPlaceholder />;
  }
  
  // Filter scripts by OS if necessary
  const filteredScripts = filterOS === 'all' 
    ? categoryData.scripts 
    : categoryData.scripts.filter(script => script.os === filterOS || script.os === 'cross-platform');

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

  return (
    <>
      <Head>
        <title>{categoryData.title} Scripts | Sp1sh</title>
        <meta name="description" content={categoryData.description} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6">
          {categoryData.breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <FiChevronRight className="mx-2 mt-0.5" />}
              {index === categoryData.breadcrumbs.length - 1 ? (
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
          <div className="flex items-start justify-between">
            <div className="flex">
              {categoryData.iconEmoji && (
                <div className="mr-4 text-4xl">{categoryData.iconEmoji}</div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {categoryData.title}
                </h1>
                <p className={`text-gray-600 dark:text-gray-300 ${!expandedInfo && 'line-clamp-2'}`}>
                  {categoryData.description}
                  {expandedInfo && (
                    <>
                      <br/><br/>
                      This category contains {categoryData.scripts.length} scripts and {categoryData.subcategories.length} subcategories.
                      Browse the available scripts below or explore subcategories for more specific solutions.
                    </>
                  )}
                </p>
                {categoryData.description.length > 120 && (
                  <button 
                    onClick={() => setExpandedInfo(!expandedInfo)}
                    className="text-primary dark:text-primary-light text-sm font-medium flex items-center mt-2"
                  >
                    {expandedInfo ? 'Show less' : 'Show more'}
                    <FiChevronDown className={`ml-1 transform transition-transform ${expandedInfo ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
            
            {categoryData.parentCategory && (
              <Link 
                href={categoryData.parentCategory.path}
                className="flex items-center text-primary dark:text-primary-light text-sm font-medium bg-primary/5 dark:bg-primary-dark/10 px-3 py-1.5 rounded-md hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to {categoryData.parentCategory.name}
              </Link>
            )}
          </div>
        </div>
        
        {/* Subcategories Section */}
        {categoryData.subcategories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {categoryData.subcategories.length > 0 && 'Subcategories'}
            </h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categoryData.subcategories.map((subcategory) => (
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
                      <FiFolder className="w-6 h-6 mr-3 text-primary dark:text-primary-light" />
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
                  {viewMode === 'grid' ? (
                    <ScriptCard script={script} />
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {script.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                              {script.description}
                            </p>
                          </div>
                          <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                            script.os === 'linux' ? 'bg-linux-green/10 text-linux-green' :
                            script.os === 'windows' ? 'bg-windows-blue/10 text-windows-blue' :
                            script.os === 'macos' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {script.os === 'linux' && '🐧 '}
                            {script.os === 'windows' && '🪟 '}
                            {script.os === 'macos' && '🍎 '}
                            {script.os === 'cross-platform' && '🔄 '}
                            {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {script.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {script.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                              +{script.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>{script.rating.toFixed(1)}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>⬇️</span>
                              <span>{script.downloads.toLocaleString()}</span>
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
                  )}
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
              {filterOS !== 'all' && (
                <button
                  onClick={() => setFilterOS('all')}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
                >
                  Show All OS
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default DynamicCategoryPage;