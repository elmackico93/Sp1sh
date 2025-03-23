import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;
  const { setSearchTerm, isLoading } = useScripts();
  
  useEffect(() => {
    if (tag && typeof tag === 'string') {
      // Set search term to the tag value
      setSearchTerm(tag);
      
      // This is a temporary page, redirect to home with the search applied
      router.push({
        pathname: '/',
        query: { search: tag }
      });
    }
  }, [tag, setSearchTerm, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${tag} Scripts | Sp1sh`} description={`Browse scripts tagged with ${tag}`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to tagged scripts...</h1>
      </div>
    </Layout>
  );
}
