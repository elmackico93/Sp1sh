import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../context/ScriptsContext';
import { Hero } from '../components/home/Hero';
import { EnhancedSearchResultsPage } from '../components/search/EnhancedSearchResultsPage';
import { EmergencyBanner } from '../components/home/EmergencyBanner';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { dynamicImport } from '../utils/dynamicImports';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchTransition } from '../hooks/useSearchTransition';

// Dynamically import heavy components
const EmergencyScripts = dynamicImport('EmergencyScripts');
const FeaturedScript = dynamicImport('FeaturedScript');
const OSTabs = dynamicImport('OSTabs');
const TrendingTable = dynamicImport('TrendingTable');
const CategoriesSection = dynamicImport('CategoriesSection');
const QuickActions = dynamicImport('QuickActions');

export default function Home() {
  const { setSearchTerm, isLoading, searchTerm } = useScripts();
  const router = useRouter();
  const { search } = router.query;
  const {
    isAnimating,
    isSearchSticky,
    searchInputRef,
    heroRef,
    targetPositionRef,
    capturePositions,
    initiateSearchTransition,
    resetSearchTransition
  } = useSearchTransition();
  const [searchTransition, setSearchTransition] = useState(null);
  
  // Handle search submission from Hero
  const handleHeroSearch = (term) => {
    // Capture positions before any state changes
    const positions = capturePositions();
    setSearchTransition(positions);
    
    // Start the animation
    initiateSearchTransition();
    
    // Set the search term (this will eventually trigger the search results to display)
    // We add a slight delay so the animation starts first
    setTimeout(() => {
      setSearchTerm(term);
    }, 100);
  };

  // Preload components when network is idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('../components/home/FeaturedScript');
        import('../components/home/OSTabs');
      });
    }
  }, []);

  // Set search term from URL parameter if present
  useEffect(() => {
    if (search && typeof search === 'string') {
      setSearchTerm(search);
    }
  }, [search, setSearchTerm]);

  // Reset animation when search is cleared
  useEffect(() => {
    if (!searchTerm) {
      resetSearchTransition();
    }
  }, [searchTerm]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      {/* We need a placeholder for where the search will animate to */}
      <div className="sticky top-16 z-40 invisible" ref={targetPositionRef}>
        <div className="container mx-auto px-4 py-2">
          <div className="w-full max-w-2xl mx-auto">
            {/* This is just a placeholder to get position reference */}
            <div className="h-12 w-full"></div>
          </div>
        </div>
      </div>
      
      {/* Hero section with ref passed to the search input */}
      <AnimatePresence>
        {!searchTerm && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { 
                height: { delay: 0.2, duration: 0.4 },
                opacity: { duration: 0.3 }
              }
            }}
            ref={heroRef}
          >
            <Hero searchInputRef={searchInputRef} onSearch={handleHeroSearch} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sticky search bar that appears after animation */}
      <AnimatePresence>
        {isSearchSticky && searchTerm && (
          <motion.div 
            className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-2">
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 px-4 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
                    placeholder="Search scripts..."
                  />
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Animating search input (positioned absolutely during transition) */}
      <AnimatePresence>
        {isAnimating && searchTransition && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.div
              className="search-transition-container mx-auto"
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{ 
                x: searchTransition.x, 
                y: searchTransition.y, 
                scale: searchTransition.scale
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5
              }}
              style={{
                position: 'absolute',
                // We'll position this exactly where the search input was
                top: searchInputRef.current?.getBoundingClientRect().top || 0,
                left: searchInputRef.current?.getBoundingClientRect().left || 0,
                width: searchInputRef.current?.offsetWidth || 'auto',
                height: searchInputRef.current?.offsetHeight || 'auto'
              }}
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full shadow-lg">
                {/* Empty div that looks like the search input */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - search results or regular content */}
      <AnimatePresence mode="wait">
        {searchTerm ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut",
              // Delay entrance slightly to allow hero to collapse
              delay: isAnimating ? 0.4 : 0
            }}
          >
            <EnhancedSearchResultsPage />
          </motion.div>
        ) : (
          <motion.div
            key="regular-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 mt-6">
              <EmergencyBanner />
              <TerminalPreview />
              <EmergencyScripts />
              <FeaturedScript />
              <OSTabs />
              <TrendingTable />
              <CategoriesSection />
              <QuickActions />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}