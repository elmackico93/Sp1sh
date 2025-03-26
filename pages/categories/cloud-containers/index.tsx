import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCloud, 
  FiBox, 
  FiLayers, 
  FiDatabase, 
  FiUploadCloud, 
  FiPackage, 
  FiZap, 
  FiShield, 
  FiServer,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiCode,
  FiExternalLink,
  FiTerminal,
  FiX,
  FiGitPullRequest
} from 'react-icons/fi';
import { useScripts } from '../../../context/ScriptsContext';
import { ScriptCard } from '../../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';
import { EnhancedSearch } from '../../../components/search/EnhancedSearch';

// Define subcategories for Cloud & Containers
const subcategories = [
  {
    id: 'container-management',
    name: 'Container Management',
    icon: <FiBox className="w-6 h-6" />,
    description: 'Scripts for managing containers, orchestration, and deployment (Docker, Kubernetes).',
    path: '/categories/cloud-containers/container-management',
    tags: ['docker', 'kubernetes', 'containers', 'orchestration', 'k8s']
  },
  {
    id: 'cloud-operations',
    name: 'Cloud Operations',
    icon: <FiCloud className="w-6 h-6" />,
    description: 'Automate cloud deployments, resource scaling, and infrastructure management.',
    path: '/categories/cloud-containers/cloud-operations',
    tags: ['aws', 'azure', 'gcp', 'cloud', 'infrastructure']
  },
  {
    id: 'serverless-functions',
    name: 'Serverless Functions',
    icon: <FiUploadCloud className="w-6 h-6" />,
    description: 'Deploy and manage serverless functions and event-driven architectures.',
    path: '/categories/cloud-containers/serverless-functions',
    tags: ['lambda', 'serverless', 'functions', 'faas', 'event-driven']
  },
  {
    id: 'storage-databases',
    name: 'Storage & Databases',
    icon: <FiDatabase className="w-6 h-6" />,
    description: 'Manage databases, backups, data migrations, and cloud storage solutions.',
    path: '/categories/cloud-containers/storage-databases',
    tags: ['databases', 'storage', 'backup', 'migration', 's3']
  }
];

// Cloud best practices
const cloudBestPractices = [
  {
    title: 'Immutable Infrastructure',
    description: 'Treat infrastructure as code and create new instances rather than modifying existing ones.',
    icon: <FiBox className="w-8 h-8 text-cyan-500" />
  },
  {
    title: 'Zero Trust Security',
    description: 'Implement least privilege access and verify all connections regardless of origin.',
    icon: <FiShield className="w-8 h-8 text-cyan-500" />
  },
  {
    title: 'Automation & CI/CD',
    description: 'Automate deployments and infrastructure changes through continuous integration pipelines.',
    icon: <FiGitPullRequest className="w-8 h-8 text-cyan-500" />
  },
  {
    title: 'Resource Optimization',
    description: 'Regularly review and optimize your cloud resources to reduce costs and improve performance.',
    icon: <FiZap className="w-8 h-8 text-cyan-500" />
  }
];

// Example terminal commands for the demo section
const terminalCommands = [
  { command: 'docker run -d -p 80:80 nginx', description: 'Start Nginx container' },
  { command: 'kubectl get pods --all-namespaces', description: 'List all Kubernetes pods' },
  { command: 'aws s3 ls', description: 'List S3 buckets' },
  { command: 'terraform apply', description: 'Apply infrastructure changes' }
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

const CloudContainersPage = () => {
  const { setCurrentCategory, allScripts, isLoading } = useScripts();
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOS, setFilterOS] = useState<'all' | 'linux' | 'windows' | 'macos' | 'cross-platform'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'downloads' | 'rating' | 'date' | 'name'>('downloads');
  const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTerminalCommand, setActiveTerminalCommand] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const codeRef = useRef<HTMLPreElement>(null);
  
  const router = useRouter();
  
  // Initialize category on page load
  useEffect(() => {
    setCurrentCategory('cloud-containers');
    
    // Get URL params for filter states
    const { subcategory, q, os, view, sort } = router.query;
    
    if (subcategory && typeof subcategory === 'string') {
      setActiveSubcategory(subcategory);
    }
    
    if (q && typeof q === 'string') {
      setSearchQuery(q);
    }
    
    if (os && typeof os === 'string' && ['all', 'linux', 'windows', 'macos', 'cross-platform'].includes(os)) {
      setFilterOS(os as any);
    }
    
    if (view && typeof view === 'string' && ['grid', 'list'].includes(view)) {
      setViewMode(view as 'grid' | 'list');
    }
    
    if (sort && typeof sort === 'string' && ['downloads', 'rating', 'date', 'name'].includes(sort)) {
      setSortOption(sort as any);
    }
  }, [setCurrentCategory, router.query]);
  
  // Filter scripts based on active filters
  useEffect(() => {
    if (allScripts.length > 0) {
      // Start with all cloud-containers scripts
      let scripts = allScripts.filter(script => 
        script.category === 'cloud-containers' || 
        script.tags.some(tag => 
          ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'container', 'cloud'].includes(tag)
        )
      );
      
      // Filter by subcategory
      if (activeSubcategory) {
        const category = subcategories.find(cat => cat.id === activeSubcategory);
        if (category) {
          scripts = scripts.filter(script => 
            script.tags.some(tag => category.tags.includes(tag))
          );
        }
      }
      
      // Filter by OS
      if (filterOS !== 'all') {
        scripts = scripts.filter(script => 
          script.os === filterOS || script.os === 'cross-platform'
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        scripts = scripts.filter(script => 
          script.title.toLowerCase().includes(query) ||
          script.description.toLowerCase().includes(query) ||
          script.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      scripts = sortScripts(scripts, sortOption);
      
      setFilteredScripts(scripts);
    }
  }, [allScripts, activeSubcategory, filterOS, searchQuery, sortOption]);
  
  // Sort scripts based on selected option
  const sortScripts = (scripts: any[], sortBy: string): any[] => {
    switch (sortBy) {
      case 'downloads':
        return [...scripts].sort((a, b) => b.downloads - a.downloads);
      case 'rating':
        return [...scripts].sort((a, b) => b.rating - a.rating);
      case 'date':
        return [...scripts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case 'name':
        return [...scripts].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return scripts;
    }
  };
  
  // Update URL when filters change
  useEffect(() => {
    // Only update after initial load
    if (allScripts.length > 0) {
      // Build query params
      const queryParams: Record<string, string> = {};
      
      if (activeSubcategory) {
        queryParams.subcategory = activeSubcategory;
      }
      
      if (filterOS !== 'all') {
        queryParams.os = filterOS;
      }
      
      if (searchQuery) {
        queryParams.q = searchQuery;
      }
      
      if (viewMode !== 'grid') {
        queryParams.view = viewMode;
      }
      
      if (sortOption !== 'downloads') {
        queryParams.sort = sortOption;
      }
      
      // Update URL without page reload
      router.push(
        {
          pathname: router.pathname,
          query: Object.keys(queryParams).length > 0 ? queryParams : undefined
        },
        undefined,
        { shallow: true }
      );
    }
  }, [activeSubcategory, filterOS, searchQuery, viewMode, sortOption, allScripts.length, router]);
  
  // Get popular scripts (top 3 by downloads)
  const popularScripts = allScripts
    .filter(script => script.category === 'cloud-containers')
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  
  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Toggle subcategory filter
  const toggleSubcategory = (subcategoryId: string) => {
    setActiveSubcategory(prev => prev === subcategoryId ? null : subcategoryId);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveSubcategory(null);
    setFilterOS('all');
    setSearchQuery('');
  };
  
  // Terminal demo functions
  const runTerminalCommand = (index: number) => {
    setActiveTerminalCommand(index);
    const command = terminalCommands[index];
    
    // Simulate terminal output
    setTerminalOutput([`$ ${command.command}`, '']);
    
    // Simulate command execution with delay
    setTimeout(() => {
      let output: string[] = [];
      
      switch (index) {
        case 0: // docker run
          output = [
            '5a8f89adefc2072a0fe261ad3cd5f271b31eb0823eb03faf0a2c31e63f4c87a9',
            'Container started successfully!'
          ];
          break;
        case 1: // kubectl
          output = [
            'NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE',
            'kube-system   coredns-558bd4d5db-9ptbz                 1/1     Running   0          24h',
            'kube-system   coredns-558bd4d5db-qvtjj                 1/1     Running   0          24h',
            'kube-system   etcd-minikube                            1/1     Running   0          24h',
            'kube-system   kube-apiserver-minikube                  1/1     Running   0          24h',
            'kube-system   kube-controller-manager-minikube         1/1     Running   0          24h',
            'default       nginx-deployment-66b6c48dd5-7bvgr        1/1     Running   0          12h'
          ];
          break;
        case 2: // aws s3
          output = [
            '2023-10-15 12:34:18 app-assets-bucket',
            '2023-11-20 09:12:45 data-processing-bucket',
            '2024-01-05 15:22:33 website-static-content'
          ];
          break;
        case 3: // terraform
          output = [
            'Terraform will perform the following actions:',
            '',
            '  # aws_instance.web will be created',
            '  + resource "aws_instance" "web" {',
            '      + ami                          = "ami-0c55b159cbfafe1f0"',
            '      + instance_type                = "t2.micro"',
            '      + tags                         = {',
            '          + "Name" = "WebServer"',
            '        }',
            '    }',
            '',
            'Plan: 1 to add, 0 to change, 0 to destroy.',
            '',
            'Apply complete! Resources: 1 added, 0 changed, 0 destroyed.'
          ];
          break;
      }
      
      setTerminalOutput(prev => [...prev, ...output]);
    }, 500);
  };

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      <Head>
        <title>Cloud & Containers Scripts | Sp1sh</title>
        <meta name="description" content="Expert-curated scripts for cloud infrastructure, container management, serverless applications, and cloud-native deployments." />
        <meta name="keywords" content="cloud scripts, container scripts, docker, kubernetes, aws, azure, gcp, serverless, cloud-native" />
      </Head>
      
      {/* Hero Section with Cloud Animation Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Cloud pattern background */}
        <div className="absolute inset-0 opacity-10 z-0">
          <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cloud-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M30,50 a20,20 0 0,1 40,0 a10,10 0 0,1 10,10 a15,15 0 0,1 -50,0 a10,10 0 0,1 0,-10 Z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cloud-pattern)" />
          </svg>
        </div>
        
        {/* Floating cloud icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute text-cyan-500/30"
              animate={{ 
                x: [0, Math.random() * 20 - 10], 
                y: [0, Math.random() * 20 - 10] 
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 5 + Math.random() * 5 
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${24 + Math.random() * 32}px`
              }}
            >
              {i % 3 === 0 ? <FiCloud /> : i % 3 === 1 ? <FiBox /> : <FiDatabase />}
            </motion.div>
          ))}
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
                  <FiCloud className="mr-2" />
                  <span>Cloud-Native Solutions</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                  Cloud & Containers Scripts
                </h1>
                
                <p className="text-xl text-gray-300 mb-8">
                  Next-gen deployment and orchestration scripts at your fingertips. Build, deploy, and manage cloud-native infrastructure with expert-crafted solutions.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="#cloud-areas" 
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Explore Cloud Scripts
                  </a>
                  <Link 
                    href="/add-script" 
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
                  >
                    Contribute a Script
                  </Link>
                </div>
              </motion.div>
              
              {/* Animated Infrastructure Diagram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex justify-center items-center"
              >
                <div className="relative w-full max-w-md">
                  {/* Cloud Platform */}
                  <motion.div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-64 border border-cyan-500/30"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FiCloud className="text-cyan-400" />
                      <div className="text-sm font-medium">Cloud Provider</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i} 
                          className="h-6 bg-cyan-500/20 rounded"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 2, 
                            delay: i * 0.4 
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Container Orchestration */}
                  <motion.div 
                    className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-72 border border-cyan-500/30"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FiBox className="text-cyan-400" />
                      <div className="text-sm font-medium">Container Orchestration</div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div 
                          key={i} 
                          className="h-10 w-10 bg-cyan-500/20 rounded-md flex items-center justify-center"
                          animate={{ 
                            scale: i % 2 === 0 ? [1, 1.1, 1] : [1, 0.9, 1] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 3, 
                            delay: i * 0.3 
                          }}
                        >
                          <div className="h-4 w-4 rounded-full bg-cyan-400/40" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Database Services */}
                  <motion.div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-56 border border-cyan-500/30"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FiDatabase className="text-cyan-400" />
                      <div className="text-sm font-medium">Storage Services</div>
                    </div>
                    <div className="h-8 bg-cyan-500/20 rounded w-full">
                      <motion.div 
                        className="h-full bg-cyan-400/30 rounded" 
                        animate={{ width: ['20%', '80%', '40%', '60%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 8 }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                    <motion.path 
                      d="M160,55 C160,100 160,110 160,130" 
                      stroke="rgba(34, 211, 238, 0.3)" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="5,5"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <motion.path 
                      d="M160,170 C160,190 160,200 160,230" 
                      stroke="rgba(34, 211, 238, 0.3)" 
                      strokeWidth="2" 
                      fill="none"
                      strokeDasharray="5,5"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="currentColor" className="text-gray-50 dark:text-gray-900">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Search with Filters */}
        <section className="mb-12 -mt-16 relative z-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiSearch className="text-cyan-500" />
                Find Cloud & Container Scripts
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <EnhancedSearch 
                  placeholder="Search cloud scripts, containers, K8s, serverless..."
                  onSearch={handleSearch}
                  variant="expanded"
                  showFilters={false}
                  maxResults={5}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filter OS:</div>
                <button
                  onClick={() => setFilterOS('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    filterOS === 'all'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterOS('linux')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1 ${
                    filterOS === 'linux'
                      ? 'bg-linux-green text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>🐧</span> Linux
                </button>
                <button
                  onClick={() => setFilterOS('windows')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1 ${
                    filterOS === 'windows'
                      ? 'bg-windows-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>🪟</span> Windows
                </button>
                <button
                  onClick={() => setFilterOS('macos')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1 ${
                    filterOS === 'macos'
                      ? 'bg-gray-800 text-white dark:bg-gray-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>🍎</span> macOS
                </button>
                
                {(activeSubcategory || filterOS !== 'all' || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center gap-1"
                  >
                    <FiX className="w-3 h-3" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Active filters */}
            {(activeSubcategory || filterOS !== 'all' || searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                
                {activeSubcategory && (
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs rounded-md flex items-center">
                    Category: {subcategories.find(s => s.id === activeSubcategory)?.name}
                    <button 
                      onClick={() => setActiveSubcategory(null)}
                      className="ml-1 text-cyan-500/70 hover:text-cyan-500"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filterOS !== 'all' && (
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs rounded-md flex items-center">
                    OS: {filterOS.charAt(0).toUpperCase() + filterOS.slice(1)}
                    <button 
                      onClick={() => setFilterOS('all')}
                      className="ml-1 text-cyan-500/70 hover:text-cyan-500"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {searchQuery && (
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs rounded-md flex items-center">
                    Search: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1 text-cyan-500/70 hover:text-cyan-500"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {filteredScripts.length} results
                </span>
              </div>
            )}
          </div>
        </section>
        
        {/* Subcategories Section */}
        <section id="cloud-areas" className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiCloud className="text-cyan-500" />
            Cloud & Container Areas
          </h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {subcategories.map((subcategory) => {
              const isActive = activeSubcategory === subcategory.id;
              const matchingScripts = allScripts.filter(script => 
                script.tags.some(tag => subcategory.tags.includes(tag))
              ).length;
              
              return (
                <motion.div
                  key={subcategory.id}
                  variants={itemVariants}
                  className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border ${
                    isActive 
                      ? 'border-cyan-500 border-l-4' 
                      : 'border-gray-100 dark:border-gray-700'
                  } transition-all duration-200 hover:shadow-md ${
                    isActive ? 'ring-2 ring-offset-2 ring-cyan-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg ${
                        isActive ? 'bg-cyan-500/10' : 'bg-gray-100 dark:bg-gray-700'
                      } flex items-center justify-center ${
                        isActive ? 'text-cyan-500' : 'text-gray-700 dark:text-gray-300'
                      } mr-4`}>
                        {subcategory.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {subcategory.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {subcategory.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {subcategory.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      {subcategory.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                          +{subcategory.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {matchingScripts} scripts
                      </span>
                      
                      <button
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-md inline-flex items-center gap-1 ${
                          isActive
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isActive ? 'Selected' : 'Browse Scripts'}
                        {isActive ? <FiCheck className="w-3 h-3" /> : <FiChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
        
        {/* Popular Scripts Section */}
        {!activeSubcategory && !searchQuery && filterOS === 'all' && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiZap className="text-cyan-500" />
                Popular Cloud Scripts
              </h2>
              
              <Link 
                href="/categories/cloud-containers/all" 
                className="text-sm font-medium text-cyan-500 hover:underline inline-flex items-center gap-1"
              >
                View all <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularScripts.map((script) => (
                <motion.div
                  key={script.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ScriptCard script={script} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
        
        {/* Scripts Section with Filters */}
        {(activeSubcategory || searchQuery || filterOS !== 'all') && (
          <section className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activeSubcategory 
                  ? `${subcategories.find(s => s.id === activeSubcategory)?.name} Scripts` 
                  : "Cloud & Container Scripts"}
                {filteredScripts.length > 0 && ` (${filteredScripts.length})`}
              </h2>
              
              <div className="flex items-center gap-4">
                {/* View mode selector */}
                <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${
                      viewMode === 'list'
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    aria-label="List view"
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort selector */}
                <select 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="downloads">Most Downloads</option>
                  <option value="rating">Highest Rated</option>
                  <option value="date">Newest First</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
            
            {filteredScripts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }
              >
                {filteredScripts.map((script) => (
                  <motion.div 
                    key={script.id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ScriptCard script={script} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching scripts found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-md transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        )}
        
        {/* Terminal Demo Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiTerminal className="text-cyan-500" />
              Live Terminal Demo
            </h2>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
            >
              {showPreview ? 'Hide Demo' : 'Show Demo'}
              <FiChevronDown className={`transition-transform ${showPreview ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 mb-6"
              >
                <div className="p-2 bg-gray-800 border-b border-gray-700 flex items-center">
                  <div className="flex space-x-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">cloud-shell ~ </div>
                </div>
                
                <div className="p-4 text-gray-200 font-mono text-sm">
                  <div className="mb-4">
                    <span className="text-green-400">user@cloud-shell</span>:<span className="text-blue-400">~</span>$ <span className="text-cyan-300">try-cloud-script</span> <span className="animate-pulse">▋</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-yellow-400 mb-2">Choose a command to run:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {terminalCommands.map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => runTerminalCommand(idx)}
                          className={`text-left p-2 rounded hover:bg-gray-800 ${
                            activeTerminalCommand === idx ? 'bg-gray-800 border border-cyan-500/50' : ''
                          }`}
                        >
                          <div className="text-cyan-400">{cmd.command}</div>
                          <div className="text-gray-400 text-xs">{cmd.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {terminalOutput.length > 0 && (
                    <div className="mt-4 p-2 bg-gray-950 rounded border border-gray-800">
                      {terminalOutput.map((line, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <span className="whitespace-pre-wrap">{line}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Why Use Cloud & Containers Scripts?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-full mb-4">
                  <FiZap className="w-8 h-8 text-cyan-500" />
                </div>
                <h4 className="font-medium mb-2">Accelerate Deployment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Automate repetitive tasks and deploy applications in seconds instead of hours</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-full mb-4">
                  <FiShield className="w-8 h-8 text-cyan-500" />
                </div>
                <h4 className="font-medium mb-2">Secure Infrastructure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Use tested and validated scripts to ensure security best practices</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-full mb-4">
                  <FiGitPullRequest className="w-8 h-8 text-cyan-500" />
                </div>
                <h4 className="font-medium mb-2">Simplify CI/CD</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Integrate with your continuous integration pipelines for reliable deployments</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Cloud Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiShield className="text-cyan-500" />
            Cloud & Container Best Practices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cloudBestPractices.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
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
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Related Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/categories/devops-cicd" 
              className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md"
            >
              <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FiGitPullRequest className="text-cyan-500" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">DevOps & CI/CD</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Continuous deployment pipelines</p>
              </div>
            </Link>
            <Link 
              href="/categories/security" 
              className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md"
            >
              <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FiShield className="text-cyan-500" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">Security</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cloud access, secrets, roles</p>
              </div>
            </Link>
            <Link 
              href="/categories/monitoring" 
              className="flex items-center p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md"
            >
              <div className="w-10 h-10 mr-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FiLayers className="text-cyan-500" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">Monitoring</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Metrics, uptime, alerts</p>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="mb-12">
          <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/images/cloud-pattern.svg')] bg-repeat"></div>
            
            <div className="relative p-8 md:p-12 z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Contribute Your Cloud Expertise
                  </h2>
                  <p className="text-lg text-white/90 mb-6">
                    Share your cloud scripts with the community and help others build better cloud-native infrastructure.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/add-script" 
                      className="px-6 py-3 bg-white hover:bg-gray-100 text-cyan-600 font-medium rounded-md transition-colors"
                    >
                      Submit a Script
                    </Link>
                    <Link 
                      href="/guidelines" 
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-md transition-colors"
                    >
                      Read Submission Guidelines
                    </Link>
                  </div>
                </div>
                
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <FiCode className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative accents */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CloudContainersPage;