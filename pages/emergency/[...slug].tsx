import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { useNavigation } from '../../context/NavigationContext';
import { ScriptCard } from '../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

const EmergencySlugPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { emergencyScripts, isLoading } = useScripts();
  const { getBreadcrumbs } = useNavigation();
  const [pageTitle, setPageTitle] = useState('');
  const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
  
  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      const fullPath = `/emergency/${slug.join('/')}`;
      
      // Set page title based on slug
      const categoryTitle = slug[slug.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setPageTitle(categoryTitle);
      
      // Filter scripts based on the path
      const matchingScripts = emergencyScripts.filter(script => {
        // Match based on title and tags
        return (
          script.title.toLowerCase().includes(categoryTitle.toLowerCase()) ||
          script.tags.some(tag => 
            slug.some(s => tag.toLowerCase().includes(s.toLowerCase()))
          )
        );
      });
      
      setFilteredScripts(matchingScripts);
    }
  }, [slug, emergencyScripts]);
  
  if (isLoading || !slug) {
    return <LoadingPlaceholder />;
  }
  
  const fullPath = `/emergency/${Array.isArray(slug) ? slug.join('/') : slug}`;
  const breadcrumbs = getBreadcrumbs(fullPath);

  return (
    <>
      <Head>
        <title>{pageTitle} Emergency Scripts | Sp1sh</title>
        <meta name="description" content={`Emergency scripts for ${pageTitle}. Quick solutions for critical situations.`} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <FiChevronRight className="mx-2 mt-0.5" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-medium">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary dark:hover:text-primary-light">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
        
        {/* Category Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {pageTitle} Scripts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Critical scripts for {pageTitle.toLowerCase()} scenarios. These scripts have been verified for reliability and safety.
          </p>
        </div>
        
        {/* Scripts Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Scripts ({filteredScripts.length})
          </h2>
          
          {filteredScripts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scripts found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No emergency scripts found for this category yet.
              </p>
              <Link
                href="/emergency"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
              >
                Browse All Emergency Scripts
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default EmergencySlugPage;
