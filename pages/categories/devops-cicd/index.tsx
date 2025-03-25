import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Set current category
    setCurrentCategory('devops-cicd');
    
    // Push to dynamic category page
    router.push('/categories/devops-cicd');
  }, [setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return null;
}
