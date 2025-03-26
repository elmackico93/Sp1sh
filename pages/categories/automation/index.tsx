// pages/categories/automation/index.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiRefreshCw, 
  FiZap, 
  FiClock, 
  FiTool, 
  FiTrello, 
  FiServer, 
  FiRepeat,
  FiCode,
  FiPackage,
  FiGitPullRequest
} from 'react-icons/fi';
import { useScripts } from '../../../context/ScriptsContext';
import { ScriptCard } from '../../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

// Define subcategories for Automation
const subcategories = [
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    icon: <FiTrello className="w-6 h-6" />,
    description: 'Streamline repetitive tasks and create efficient work processes across different environments.',
    path: '/categories/automation/workflow-automation'
  },
  {
    id: 'system-tasks',
    name: 'System Tasks',
    icon: <FiServer className="w-6 h-6" />,
    description: 'Automate system maintenance, updates, backups, and resource management.',
    path: '/categories/automation/system-tasks'
  },
  {
    id: 'continuous-integration',
    name: 'CI/CD Pipelines',
    icon: <FiGitPullRequest className="w-6 h-6" />,
    description: 'Automate software development, testing, and deployment workflows.',
    path: '/categories/automation/continuous-integration'
  },
  {
    id: 'task-scheduling',
    name: 'Task Scheduling',
    icon: <FiClock className="w-6 h-6" />,
    description: 'Schedule and manage automated tasks, cron jobs, and periodic scripts.',
    path: '/categories/automation/task-scheduling'
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

export default function AutomationPage() {
  const { setCurrentCategory, allScripts, isLoading } = useScripts();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [popularScripts, setPopularScripts] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'workflow' | 'system' | 'cicd'>('all');
  
  useEffect(() => {
    if (!hasNavigated && typeof window !== 'undefined') {
      // Set current category
      setCurrentCategory('automation');
      setHasNavigated(true);
      
      // Get popular automation scripts
      const automationScripts = allScripts.filter(script => 
        script.category === 'automation'
      );
      
      // Sort by downloads and take top 3
      setPopularScripts(
        [...automationScripts]
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 3)
      );
    }
  }, [hasNavigated, setCurrentCategory, allScripts]);

  // Filter scripts based on active filter
  const filteredScripts = popularScripts.filter(script => {
    if (activeFilter === 'all') return true;
    
    const filterMappings = {
      'workflow': ['workflow', 'process'],
      'system': ['system', 'maintenance'],
      'cicd': ['ci/cd', 'deployment', 'pipeline']
    };
    
    return script.tags.some(tag => 
      filterMappings[activeFilter].some(filter => 
        tag.toLowerCase().includes(filter)
      )
    );
  });

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      <Head>
        <title>Automation Scripts | Sp1sh</title>
        <meta name="description" content="Powerful automation scripts to streamline and optimize your workflows across different systems and environments." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Dynamic Automation Visualization */}
        <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 mb-12 overflow-hidden border border-primary/20 shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-dot-pattern"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3"
              >
                <FiRefreshCw className="text-primary" />
                Automation Scripts
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-6"
              >
                Transform repetitive tasks into seamless, efficient workflows. Our curated automation scripts help you minimize manual interventions and maximize productivity across different environments.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link 
                  href="/add-script" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FiZap className="mr-2" /> Contribute Script
                </Link>
                <Link 
                  href="/categories/automation/getting-started" 
                  className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <FiTool className="mr-2" /> Get Started
                </Link>
              </motion.div>
            </div>
            
            {/* Animated Automation Concept Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden md:flex justify-center items-center"
            >
              <div className="relative w-72 h-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { icon: <FiCode className="w-8 h-8 text-primary" />, label: 'Script' },
                    { icon: <FiPackage className="w-8 h-8 text-primary" />, label: 'Package' },
                    { icon: <FiRepeat className="w-8 h-8 text-primary" />, label: 'Process' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.2 }}
                      className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-750 rounded-lg p-4 shadow-sm"
                    >
                      {item.icon}
                      <span className="text-xs text-gray-600 dark:text-gray-300 mt-2">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="h-full bg-primary"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Subcategories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Automation Areas
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
        
        {/* Popular Scripts Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Popular Automation Scripts
            </h2>
            <div className="flex items-center space-x-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Workflow', value: 'workflow' },
                { label: 'System', value: 'system' },
                { label: 'CI/CD', value: 'cicd' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    activeFilter === filter.value
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <AnimatePresence>
            {filteredScripts.length > 0 ? (
              <motion.div 
                key="scripts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {filteredScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-scripts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center"
              >
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Scripts Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Try adjusting your filter or check back later.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        
        {/* Automation Best Practices */}
        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Automation Best Practices
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <FiZap className="w-8 h-8 text-primary" />,
                title: 'Modular Design',
                description: 'Create reusable, single-purpose scripts that can be combined for complex workflows.'
              },
              {
                icon: <FiClock className="w-8 h-8 text-primary" />,
                title: 'Efficient Scheduling',
                description: 'Use cron jobs and system schedulers to run scripts at optimal times.'
              },
              {
                icon: <FiTool className="w-8 h-8 text-primary" />,
                title: 'Error Handling',
                description: 'Implement robust error checking and logging to ensure script reliability.'
              },
              {
                icon: <FiServer className="w-8 h-8 text-primary" />,
                title: 'Cross-Platform Compatibility',
                description: 'Design scripts that work across different operating systems and environments.'
              }
            ].map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-4">
                  {practice.icon}
                  <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                    {practice.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {practice.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Related Categories */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Related Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'DevOps & CI/CD',
                description: 'Advanced automation for software delivery',
                icon: <FiGitPullRequest className="w-8 h-8 text-primary" />,
                path: '/categories/devops-cicd'
              },
              {
                title: 'System Administration',
                description: 'System-level automation and management',
                icon: <FiServer className="w-8 h-8 text-primary" />,
                path: '/categories/system-admin'
              },
              {
                title: 'Dev Tools',
                description: 'Scripting and development workflow tools',
                icon: <FiCode className="w-8 h-8 text-primary" />,
                path: '/categories/dev-tools'
              }
            ].map((category) => (
              <Link 
                key={category.title}
                href={category.path}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all flex items-center"
              >
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}