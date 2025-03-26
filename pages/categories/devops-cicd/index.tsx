// pages/categories/devops-cicd/index.tsx
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
      setCurrentCategory('devops-cicd');
      setHasNavigated(true);
      
      // Check if we need to redirect
      // We only want to redirect if we're not already on the dynamic page
      // We can check this by examining the URL pathname
      const currentPath = window.location.pathname;
      
      // If we're on "/categories/devops-cicd/index", we don't need to redirect
      if (currentPath === '/categories/devops-cicd') {
        // No need to redirect - we're already on the correct page
        console.log('Already on the correct page, not redirecting');
        return;
      }
      
      // If we're here, we need to redirect to the dynamic category page
      console.log('Redirecting to dynamic category page');
      
      // Use plain navigation to avoid security issues
      try {
        router.push('/categories/devops-cicd', undefined, { shallow: false });
      } catch (err) {
        console.warn('Navigation error, using fallback:', err);
        // Fallback to direct location change if router.push fails
        window.location.href = '/categories/devops-cicd';
      }
    }
  }, [hasNavigated, setCurrentCategory, router]);

  // Show loading state while category is being set
  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  // This component doesn't render anything itself
  // It just handles the category setting and navigation
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">DevOps & CI/CD</h1>
      <p className="mb-4">Browse scripts for DevOps and CI/CD pipelines.</p>
      
      {/* You could add content here or load other components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content would be rendered here */}
      </div>
    </div>
  );
}