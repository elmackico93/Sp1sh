import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function OSPage() {
  const router = useRouter();
  const { os } = router.query;
  const { setCurrentOS, isLoading } = useScripts();
  
  useEffect(() => {
    if (os && typeof os === 'string') {
      // Set OS filter
      setCurrentOS(os as any);
      
      // This is a temporary page, redirect to home with the filter applied
      router.push('/');
    }
  }, [os, setCurrentOS, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${os} Scripts | Sp1sh`} description={`Browse scripts for ${os}`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to filtered scripts...</h1>
      </div>
    </Layout>
  );
}
