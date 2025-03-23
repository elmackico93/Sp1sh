import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../context/ScriptsContext';
import { Layout } from '../components/layout/Layout';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';

export default function EmergencyPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Set emergency category filter
    setCurrentCategory('emergency');
    
    // This is a temporary page, redirect to home with the filter applied
    router.push('/');
  }, [setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title="Emergency Scripts | Sp1sh" description="Browse emergency scripts for critical situations">
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to emergency scripts...</h1>
      </div>
    </Layout>
  );
}
