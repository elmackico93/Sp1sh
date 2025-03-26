import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Fix: Use proper navigation without triggering SecurityError
    if (typeof window !== 'undefined') {
      // Set current category
      setCurrentCategory('devops-cicd');
      
      // Use window.location instead of router.push to avoid potential SecurityError
      // This is a safer approach if router.push is causing SecurityErrors
      setTimeout(() => {
        window.location.href = '/categories/devops-cicd';
      }, 100);
    }
  }, [setCurrentCategory]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return null;
}
