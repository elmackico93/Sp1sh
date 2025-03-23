import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../context/ScriptsContext';
import { Hero } from '../components/home/Hero';
import { EmergencyBanner } from '../components/home/EmergencyBanner';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { EmergencyScripts } from '../components/home/EmergencyScripts';
import { FeaturedScript } from '../components/home/FeaturedScript';
import { OSTabs } from '../components/home/OSTabs';
import { TrendingTable } from '../components/home/TrendingTable';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { QuickActions } from '../components/home/QuickActions';
import { Community } from '../components/home/Community';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';

export default function Home() {
  const { setSearchTerm, isLoading } = useScripts();
  const router = useRouter();
  const { search } = router.query;

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
      
      <Community />
    </>
  );
}
