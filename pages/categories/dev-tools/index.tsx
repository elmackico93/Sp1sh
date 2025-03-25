import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Set current category
    setCurrentCategory('dev-tools');
    
    // Push to dynamic category page
    router.push('/categories/dev-tools');
  }, [setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return null;
}
