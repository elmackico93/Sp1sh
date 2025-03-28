import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../context/ScriptsContext';
import { Hero } from '../components/home/Hero';
import { SearchResultsPage } from '../components/search/SearchResultsPage';
import { EmergencyBanner } from '../components/home/EmergencyBanner';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { dynamicImport } from '../utils/dynamicImports';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';
import { AnimatePresence, motion } from 'framer-motion';

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

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      <Hero />
      
      {/* Animated transition between search results and regular content */}
      <AnimatePresence mode="wait">
        {searchTerm ? (
          // Show search results when there's a search term
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <SearchResultsPage />
          </motion.div>
        ) : (
          // Show regular content when no search
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