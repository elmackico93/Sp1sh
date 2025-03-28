import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../context/ScriptsContext';
import { Hero } from '../components/home/Hero';
import { EmergencyBanner } from '../components/home/EmergencyBanner';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { dynamicImport } from '../utils/dynamicImports';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';

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
    </>
  );
}