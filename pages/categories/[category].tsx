import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    if (category && typeof category === 'string') {
      // Set category filter
      setCurrentCategory(category as any);
      
      // This is a temporary page, redirect to home with the filter applied
      router.push('/');
    }
  }, [category, setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${category} Scripts | Sp1sh`} description={`Browse ${category} scripts`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to filtered scripts...</h1>
      </div>
    </Layout>
  );
}
