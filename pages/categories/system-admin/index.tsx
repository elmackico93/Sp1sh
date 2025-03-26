// pages/categories/system-admin/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiServer, FiUsers, FiHardDrive, FiCpu, FiRefreshCw, FiShield, FiMoreHorizontal } from 'react-icons/fi';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';
import { ScriptCard } from '../../../components/scripts/ScriptCard';
import { motion } from 'framer-motion';

// Define subcategories for System Admin
const subcategories = [
  {
    id: 'users-permissions',
    name: 'Users & Permissions',
    icon: <FiUsers className="w-6 h-6" />,
    description: 'Manage user accounts, permissions, and access control across different operating systems.',
    path: '/categories/system-admin/users-permissions'
  },
  {
    id: 'updates-patching',
    name: 'Updates & Patching',
    icon: <FiRefreshCw className="w-6 h-6" />,
    description: 'Automate system updates, patch management, and software deployment.',
    path: '/categories/system-admin/updates-patching'
  },
  {
    id: 'file-local-backup',
    name: 'File & Local Backup',
    icon: <FiHardDrive className="w-6 h-6" />,
    description: 'Scripts for file management, backup strategies, and data recovery procedures.',
    path: '/categories/system-admin/file-local-backup'
  },
  {
    id: 'processes-services',
    name: 'Processes & Services',
    icon: <FiCpu className="w-6 h-6" />,
    description: 'Monitor and manage system processes, services, and resource allocation.',
    path: '/categories/system-admin/processes-services'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function SystemAdminPage() {
  const router = useRouter();
  const { setCurrentCategory, filteredScripts, allScripts, isLoading } = useScripts();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [popularScripts, setPopularScripts] = useState<any[]>([]);
  
  useEffect(() => {
    // Prevent infinite loop - only set category once
    if (!hasNavigated && typeof window !== 'undefined') {
      // Set current category
      setCurrentCategory('system-admin');
      setHasNavigated(true);
      
      // Check if we need to redirect
      const currentPath = window.location.pathname;
      
      // If we're already on the correct page, don't redirect
      if (currentPath === '/categories/system-admin') {
        console.log('Already on the correct page, not redirecting');
        
        // Get popular system admin scripts
        const sysAdminScripts = allScripts.filter(script => 
          script.category === 'system-admin'
        );
        
        // Sort by downloads and take top 3
        setPopularScripts(
          [...sysAdminScripts]
            .sort((a, b) => b.downloads - a.downloads)
            .slice(0, 3)
        );
        
        return;
      }
      
      // If we're here, we need to redirect to the dynamic category page
      console.log('Redirecting to system-admin category page');
      
      // Use plain navigation to avoid security issues
      try {
        router.push('/categories/system-admin', undefined, { shallow: false });
      } catch (err) {
        console.warn('Navigation error, using fallback:', err);
        // Fallback to direct location change if router.push fails
        window.location.href = '/categories/system-admin';
      }
    }
  }, [hasNavigated, setCurrentCategory, router, allScripts]);

  // Show loading state while category is being set
  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 md:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              System Administration
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Powerful scripts for managing systems, users, services, and infrastructure with efficiency and security.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/os/linux" 
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors"
              >
                <span className="mr-2">🐧</span>
                Linux Scripts
              </Link>
              <Link 
                href="/os/windows" 
                className="inline-flex items-center px-4 py-2 bg-windows-blue hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                <span className="mr-2">🪟</span>
                Windows Scripts
              </Link>
              <Link 
                href="/add-script" 
                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                <span className="mr-2">+</span>
                Contribute
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-6xl">
              <FiServer className="w-20 h-20 text-primary dark:text-primary-light" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Subcategories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          System Administration Areas
        </h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subcategories.map((subcategory) => (
            <motion.div
              key={subcategory.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <Link href={subcategory.path} className="flex p-6">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-primary-light">
                    {subcategory.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {subcategory.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Featured Script */}
      {popularScripts.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Popular System Admin Scripts
            </h2>
            <Link 
              href="/categories/system-admin/all"
              className="text-sm font-medium text-primary dark:text-primary-light hover:underline"
            >
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularScripts.map((script) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        </section>
      )}
      
      {/* Tips & Best Practices */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          System Administration Tips
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex">
                <span className="mr-3 text-primary dark:text-primary-light">✓</span>
                <p className="text-gray-700 dark:text-gray-300">Always test scripts in a non-production environment first</p>
              </li>
              <li className="flex">
                <span className="mr-3 text-primary dark:text-primary-light">✓</span>
                <p className="text-gray-700 dark:text-gray-300">Add error handling to prevent unintended consequences</p>
              </li>
              <li className="flex">
                <span className="mr-3 text-primary dark:text-primary-light">✓</span>
                <p className="text-gray-700 dark:text-gray-300">Document scripts with comments for future maintainers</p>
              </li>
              <li className="flex">
                <span className="mr-3 text-primary dark:text-primary-light">✓</span>
                <p className="text-gray-700 dark:text-gray-300">Use configuration files instead of hardcoding values</p>
              </li>
              <li className="flex">
                <span className="mr-3 text-primary dark:text-primary-light">✓</span>
                <p className="text-gray-700 dark:text-gray-300">Implement logging for troubleshooting and auditing</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Related Resources */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Related Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/categories/security"
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all flex items-center"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg mr-4 text-primary">
              <FiShield />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Security</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">System hardening & protection</p>
            </div>
          </Link>
          
          <Link 
            href="/categories/automation"
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all flex items-center"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg mr-4 text-primary">
              <FiRefreshCw />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Automation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Task automation & scheduling</p>
            </div>
          </Link>
          
          <Link 
            href="/categories/monitoring"
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-all flex items-center"
          >
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg mr-4 text-primary">
              <FiMoreHorizontal />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">More Categories</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Explore all script categories</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}