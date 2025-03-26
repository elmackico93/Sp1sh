// pages/categories/dev-tools/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  const [hasNavigated, setHasNavigated] = useState(false);
  
  useEffect(() => {
    // Prevent infinite loop - only set category once
    if (!hasNavigated && typeof window !== 'undefined') {
      // Set current category
      setCurrentCategory('dev-tools');
      setHasNavigated(true);
      
      // Check if we need to redirect
      const currentPath = window.location.pathname;
      
      // If we're already on the correct page, don't redirect
      if (currentPath === '/categories/dev-tools') {
        console.log('Already on the correct page, not redirecting');
        return;
      }
      
      // If we're here, we need to redirect to the dynamic category page
      console.log('Redirecting to dev-tools category page');
      
      // Use plain navigation to avoid security issues
      try {
        router.push('/categories/dev-tools', undefined, { shallow: false });
      } catch (err) {
        console.warn('Navigation error, using fallback:', err);
        // Fallback to direct location change if router.push fails
        window.location.href = '/categories/dev-tools';
      }
    }
  }, [hasNavigated, setCurrentCategory, router]);

  // Show loading state while category is being set
  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  // Render actual content instead of null
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dev Tools</h1>
      <p className="mb-4">Scripts and utilities for developers and development environments.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content would be loaded from the scripts context */}
      </div>
    </div>
  );
}