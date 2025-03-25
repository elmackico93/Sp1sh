import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiChevronDown, FiClock, FiDownload, FiShield, FiFilter } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { Script } from '../../mocks/scripts';
import { CategoryCard } from '../../components/categories/CategoryCard';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

// Define the emergency categories from the menu structure
const emergencyCategories = [
  {
    title: 'Incident Response',
    path: '/emergency/incident-response',
    icon: '🆘',
    description: 'Tools for handling active security incidents, containing threats, and collecting critical evidence.',
    tags: ['security', 'incident', 'containment'],
    count: 12,
    level: 'critical'
  },
  {
    title: 'Forensics Analysis',
    path: '/emergency/forensics',
    icon: '🔍',
    description: 'Tools for investigating security breaches, analyzing system compromises, and collecting digital evidence.',
    tags: ['investigation', 'security', 'evidence'],
    count: 9,
    level: 'high'
  },
  {
    title: 'Disaster Recovery',
    path: '/emergency/disaster-recovery',
    icon: '🔄',
    description: 'Scripts to help recover from system failures, data loss, and critical infrastructure outages.',
    tags: ['recovery', 'backup', 'restoration'],
    count: 14,
    level: 'medium'
  }
];

// Emergency level type and helper for styling
type EmergencyLevel = 'critical' | 'high' | 'medium' | 'low' | undefined;

const getLevelStyles = (level: EmergencyLevel) => {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-emergency-red/10',
        border: 'border-emergency-red',
        text: 'text-emergency-red',
        fullBg: 'bg-emergency-red',
      };
    case 'high':
      return {
        bg: 'bg-emergency-orange/10',
        border: 'border-emergency-orange',
        text: 'text-emergency-orange',
        fullBg: 'bg-emergency-orange',
      };
    case 'medium':
    default:
      return {
        bg: 'bg-emergency-yellow/10',
        border: 'border-emergency-yellow',
        text: 'text-emergency-yellow',
        fullBg: 'bg-emergency-yellow',
      };
  }
};

const EmergencyPage: React.FC = () => {
  const { emergencyScripts, isLoading } = useScripts();
  const [showGuideInfo, setShowGuideInfo] = useState(false);
  const [filterLevel, setFilterLevel] = useState<EmergencyLevel | 'all'>('all');
  
  if (isLoading) {
    return <LoadingPlaceholder />;
  }
  
  // Filter scripts by emergency level if needed
  const filteredScripts = filterLevel === 'all' 
    ? emergencyScripts 
    : emergencyScripts.filter(script => script.emergencyLevel === filterLevel);
  
  // Group scripts by level for display
  const scriptsByLevel: { [key in EmergencyLevel]: Script[] } = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };
  
  filteredScripts.forEach(script => {
    if (script.emergencyLevel) {
      scriptsByLevel[script.emergencyLevel].push(script);
    } else {
      scriptsByLevel.medium.push(script);
    }
  });
  
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

  return (
    <>
      <Head>
        <title>Emergency Scripts | Sp1sh</title>
        <meta name="description" content="Critical system recovery, security response, and emergency diagnostics scripts for urgent situations." />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-emergency-red/20 to-emergency-red/5 rounded-lg border-l-4 border-emergency-red p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-emergency-red/5 rounded-full blur-xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emergency-red/10 rounded-full blur-xl"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
            <div className="w-16 h-16 bg-emergency-red/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-8 h-8 text-emergency-red" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Emergency Scripts
              </h1>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Quickly access verified scripts for system recovery, security incident response, and urgent diagnostics. 
                These scripts are designed for critical situations and are regularly tested for reliability.
              </p>
              
              <div>
                <button
                  onClick={() => setShowGuideInfo(!showGuideInfo)}
                  className="flex items-center text-emergency-red font-medium"
                >
                  Emergency Usage Guidelines
                  <FiChevronDown className={`ml-2 transform transition-transform ${showGuideInfo ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showGuideInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Before Running Emergency Scripts:</h3>
                      <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Review the script code carefully before execution</li>
                        <li>Run in isolation when possible to prevent further damage</li>
                        <li>Back up critical data if feasible</li>
                        <li>Document the incident and your response steps</li>
                        <li>Consider contacting professional support for critical systems</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emergency Categories */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Emergency Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyCategories.map((category) => {
              const levelStyles = getLevelStyles(category.level as EmergencyLevel);
              return (
                <div key={category.path} className={`${levelStyles.border} border-l-4`}>
                  <CategoryCard
                    title={category.title}
                    path={category.path}
                    description={category.description}
                    icon={category.icon}
                    count={category.count}
                    tags={category.tags}
                    variant="featured"
                  />
                </div>
              );
            })}
          </div>
        </section>
        
        {/* Emergency Scripts Filter */}
        <section className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All Emergency Scripts
            </h2>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter by level:</span>
              <div className="inline-flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <button
                  onClick={() => setFilterLevel('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1 ${
                    filterLevel === 'all'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <FiFilter className="w-3 h-3" />
                  All
                </button>
                <button
                  onClick={() => setFilterLevel('critical')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    filterLevel === 'critical'
                      ? 'bg-emergency-red text-white'
                      : 'text-emergency-red bg-emergency-red/5 hover:bg-emergency-red/10'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilterLevel('high')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    filterLevel === 'high'
                      ? 'bg-emergency-orange text-white'
                      : 'text-emergency-orange bg-emergency-orange/5 hover:bg-emergency-orange/10'
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setFilterLevel('medium')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    filterLevel === 'medium'
                      ? 'bg-emergency-yellow text-gray-900'
                      : 'text-emergency-yellow bg-emergency-yellow/5 hover:bg-emergency-yellow/10'
                  }`}
                >
                  Medium
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Scripts By Emergency Level */}
        <motion.div 
          className="space-y-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Critical Scripts */}
          {(filterLevel === 'all' || filterLevel === 'critical') && scriptsByLevel.critical.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-emergency-red flex items-center justify-center">
                  <FiAlertTriangle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-medium text-emergency-red">Critical Emergency Scripts</h3>
              </div>
              
              <div className="bg-emergency-red/5 border border-emergency-red/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scriptsByLevel.critical.map((script) => (
                    <motion.div key={script.id} variants={itemVariants}>
                      <Link 
                        href={`/scripts/${script.id}`}
                        className="block bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{script.title}</h4>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emergency-red text-white">
                            Critical
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {script.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiClock className="w-3 h-3" />
                              {new Date(script.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiDownload className="w-3 h-3" />
                              {script.downloads.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emergency-red">View Script →</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* High Priority Scripts */}
          {(filterLevel === 'all' || filterLevel === 'high') && scriptsByLevel.high.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-emergency-orange flex items-center justify-center">
                  <FiShield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-medium text-emergency-orange">High Priority Scripts</h3>
              </div>
              
              <div className="bg-emergency-orange/5 border border-emergency-orange/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scriptsByLevel.high.map((script) => (
                    <motion.div key={script.id} variants={itemVariants}>
                      <Link 
                        href={`/scripts/${script.id}`}
                        className="block bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{script.title}</h4>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emergency-orange text-white">
                            High
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {script.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiClock className="w-3 h-3" />
                              {new Date(script.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiDownload className="w-3 h-3" />
                              {script.downloads.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emergency-orange">View Script →</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Medium Priority Scripts */}
          {(filterLevel === 'all' || filterLevel === 'medium') && scriptsByLevel.medium.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-emergency-yellow flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-gray-900" />
                </div>
                <h3 className="text-xl font-medium text-emergency-yellow">Medium Priority Scripts</h3>
              </div>
              
              <div className="bg-emergency-yellow/5 border border-emergency-yellow/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scriptsByLevel.medium.map((script) => (
                    <motion.div key={script.id} variants={itemVariants}>
                      <Link 
                        href={`/scripts/${script.id}`}
                        className="block bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{script.title}</h4>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emergency-yellow text-gray-900">
                            Medium
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {script.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiClock className="w-3 h-3" />
                              {new Date(script.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <FiDownload className="w-3 h-3" />
                              {script.downloads.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-emergency-yellow">View Script →</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {filteredScripts.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFilter className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching scripts found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No emergency scripts match your current filter settings.
              </p>
              <button
                onClick={() => setFilterLevel('all')}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
              >
                Show All Scripts
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default EmergencyPage;