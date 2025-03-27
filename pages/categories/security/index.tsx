import React, { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShield, 
  FiLock, 
  FiServer, 
  FiKey, 
  FiUsers, 
  FiAlertTriangle,
  FiMonitor, 
  FiFileText, 
  FiCheckCircle, 
  FiSearch, 
  FiFilter, 
  FiRefreshCw, 
  FiChevronDown, 
  FiChevronRight, 
  FiHelpCircle, 
  FiClock, 
  FiStar, 
  FiDownload,
  FiX, 
  FiGrid, 
  FiList, 
  FiEye, 
  FiChevronUp, 
  FiExternalLink, 
  FiAward, 
  FiCopy, 
  FiInfo,
  FiWifi,
  FiTerminal
} from 'react-icons/fi';

import { useScripts } from '../../../context/ScriptsContext';
import { ScriptCard } from '../../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';
import { EnhancedSearch } from '../../../components/search/EnhancedSearch';

// Types for security subcategories
type SecurityLevel = 'critical' | 'high' | 'medium' | 'low';
type ViewMode = 'grid' | 'list' | 'compact';
type SortOption = 'downloads' | 'rating' | 'date' | 'name';

interface SecuritySubcategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  level: SecurityLevel;
  tags: string[];
  resources?: {
    title: string;
    url: string;
  }[];
  commandLine?: string;
}

interface SecurityTip {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

interface SecurityStatistic {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Define security subcategories with enhanced metadata
const securitySubcategories: SecuritySubcategory[] = [
  {
    id: 'hardening',
    name: 'System Hardening',
    description: 'Scripts to strengthen system security posture, reduce attack surface, and eliminate vulnerabilities.',
    icon: <FiShield className="w-6 h-6" />,
    path: '/categories/security/hardening',
    level: 'high',
    tags: ['hardening', 'lockdown', 'security-baseline', 'compliance'],
    resources: [
      { title: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks/' },
      { title: 'NIST Security Guidelines', url: 'https://www.nist.gov/cyberframework' }
    ],
    commandLine: 'sudo sh ./system-hardening.sh --apply-all --backup'
  },
  {
    id: 'firewalls',
    name: 'Firewall & IPS',
    description: 'Network traffic control, packet filtering, and intrusion prevention system configurations.',
    icon: <FiServer className="w-6 h-6" />,
    path: '/categories/security/firewall-ips',
    level: 'critical',
    tags: ['firewall', 'iptables', 'network-security', 'intrusion-prevention'],
    resources: [
      { title: 'Iptables Essential Guide', url: 'https://wiki.archlinux.org/title/iptables' },
      { title: 'Snort IPS Documentation', url: 'https://www.snort.org/documents' }
    ],
    commandLine: 'iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT'
  },
  {
    id: 'encryption',
    name: 'Encryption & Data Protection',
    description: 'File and disk encryption, data-at-rest protection, and secure communication scripts.',
    icon: <FiLock className="w-6 h-6" />,
    path: '/categories/security/encryption',
    level: 'high',
    tags: ['encryption', 'ssl', 'tls', 'data-protection'],
    resources: [
      { title: 'OpenSSL Cookbook', url: 'https://www.feistyduck.com/library/openssl-cookbook/' },
      { title: 'LUKS Encryption Guide', url: 'https://wiki.archlinux.org/title/dm-crypt' }
    ],
    commandLine: 'openssl enc -aes-256-cbc -salt -in file.txt -out file.enc'
  },
  {
    id: 'authentication',
    name: 'Authentication & Access Control',
    description: 'Strong authentication mechanisms, access control enforcement, and privilege management.',
    icon: <FiKey className="w-6 h-6" />,
    path: '/categories/security/authentication',
    level: 'high', 
    tags: ['authentication', 'mfa', 'rbac', 'access-control'],
    resources: [
      { title: 'PAM Configuration Guide', url: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system-level_authentication_guide/pluggable_authentication_modules' },
      { title: 'NIST Authentication Guidelines', url: 'https://pages.nist.gov/800-63-3/' }
    ],
    commandLine: 'sudo pam-auth-update --enable mfa'
  },
  {
    id: 'monitoring',
    name: 'Security Monitoring & Auditing',
    description: 'Scripts for log collection, security event monitoring, and compliance auditing.',
    icon: <FiMonitor className="w-6 h-6" />,
    path: '/categories/security/monitoring',
    level: 'medium',
    tags: ['siem', 'logging', 'auditing', 'monitoring'],
    resources: [
      { title: 'ELK Stack Guide', url: 'https://www.elastic.co/guide/index.html' },
      { title: 'Auditd Configuration', url: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/security_guide/sec-understanding_audit_log_files' }
    ],
    commandLine: 'sudo auditctl -w /etc/passwd -p wa -k passwd_changes'
  },
  {
    id: 'incident-response',
    name: 'Incident Response',
    description: 'Tools for security incident handling, evidence collection, and breach containment.',
    icon: <FiAlertTriangle className="w-6 h-6" />,
    path: '/categories/security/incident-response',
    level: 'critical',
    tags: ['incident', 'forensics', 'response', 'containment'],
    resources: [
      { title: 'SANS Incident Handler\'s Handbook', url: 'https://www.sans.org/white-papers/33901/' },
      { title: 'NIST Incident Response Guide', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf' }
    ],
    commandLine: 'sudo ./incident-collector.sh -t memory,network,disk -o /forensics/'
  }
];

// Security tips for the resource section
const securityTips: SecurityTip[] = [
  {
    title: "Principle of Least Privilege",
    description: "Grant minimal access rights required for users to perform their functions. Regularly review and audit permissions.",
    icon: <FiUsers className="w-5 h-5" />,
    link: "/guides/security/least-privilege"
  },
  {
    title: "Defense in Depth",
    description: "Implement multiple layers of security controls throughout your systems. Don't rely on a single protection mechanism.",
    icon: <FiShield className="w-5 h-5" />,
    link: "/guides/security/defense-in-depth"
  },
  {
    title: "Regular Security Audits",
    description: "Perform scheduled security reviews to identify and mitigate vulnerabilities. Document and track findings over time.",
    icon: <FiFileText className="w-5 h-5" />,
    link: "/guides/security/audits"
  },
  {
    title: "Keep Systems Updated",
    description: "Apply security patches promptly to protect against known vulnerabilities. Establish a systematic patching process.",
    icon: <FiRefreshCw className="w-5 h-5" />,
    link: "/guides/security/patching"
  },
  {
    title: "Encrypt Sensitive Data",
    description: "Use strong encryption for data at rest and in transit. Properly manage and secure encryption keys.",
    icon: <FiLock className="w-5 h-5" />,
    link: "/guides/security/encryption"
  },
  {
    title: "Monitor and Log",
    description: "Implement comprehensive logging and monitoring to detect and respond to security events quickly.",
    icon: <FiMonitor className="w-5 h-5" />,
    link: "/guides/security/monitoring"
  }
];

// Security statistics
const securityStatistics: SecurityStatistic[] = [
  {
    label: "Security Scripts",
    value: 248,
    icon: <FiShield className="w-5 h-5" />,
    change: "+12% this month",
    trend: "up"
  },
  {
    label: "Downloads",
    value: "125K+",
    icon: <FiDownload className="w-5 h-5" />,
    change: "+8% this month",
    trend: "up"
  },
  {
    label: "Avg. Rating",
    value: 4.7,
    icon: <FiStar className="w-5 h-5" />,
    change: "+0.2 this month",
    trend: "up"
  },
  {
    label: "Contributors",
    value: 78,
    icon: <FiUsers className="w-5 h-5" />,
    change: "5 new this month",
    trend: "up"
  }
];

// Animation variants for smooth transitions
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
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

// Helper function to get styling based on security level
const getLevelStyles = (level: SecurityLevel) => {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500',
        text: 'text-red-600 dark:text-red-500',
        ring: 'ring-red-500',
        badge: 'bg-red-500 text-white'
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500',
        text: 'text-orange-600 dark:text-orange-500',
        ring: 'ring-orange-500',
        badge: 'bg-orange-500 text-white'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500',
        text: 'text-yellow-600 dark:text-yellow-500',
        ring: 'ring-yellow-500',
        badge: 'bg-yellow-500 text-gray-900'
      };
    case 'low':
    default:
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500',
        text: 'text-blue-600 dark:text-blue-500',
        ring: 'ring-blue-500',
        badge: 'bg-blue-500 text-white'
      };
  }
};

const SecurityCategoryPage = () => {
  const router = useRouter();
  const { allScripts, isLoading } = useScripts();
  const [securityScripts, setSecurityScripts] = useState<any[]>([]);
  const [featuredScripts, setFeaturedScripts] = useState<any[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('downloads');
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [filterOS, setFilterOS] = useState<'all' | 'linux' | 'windows' | 'macos' | 'cross-platform'>('all');
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showResources, setShowResources] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [activeScript, setActiveScript] = useState<string | null>(null);
  const [isCopySuccess, setIsCopySuccess] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Total scripts count
  const totalScriptsCount = useMemo(() => securityScripts.length, [securityScripts]);
  
  // Get current URL query params to sync with UI state
  useEffect(() => {
    // Initialize state from URL if present
    const { subcategory, os, q, view, sort } = router.query;
    
    if (subcategory && typeof subcategory === 'string') {
      setActiveSubcategory(subcategory);
    }
    
    if (os && typeof os === 'string' && ['all', 'linux', 'windows', 'macos', 'cross-platform'].includes(os)) {
      setFilterOS(os as any);
    }
    
    if (q && typeof q === 'string') {
      setSearchQuery(q);
    }
    
    if (view && typeof view === 'string' && ['grid', 'list', 'compact'].includes(view)) {
      setViewMode(view as ViewMode);
    }
    
    if (sort && typeof sort === 'string' && ['downloads', 'rating', 'date', 'name'].includes(sort)) {
      setSortOption(sort as SortOption);
    }
  }, [router.query]);
  
  // Filter scripts by subcategory, OS, and search query
  useEffect(() => {
    if (allScripts.length > 0) {
      // Get all security-related scripts
      const security = allScripts.filter(script => 
        script.category === 'security' || 
        script.tags.some(tag => 
          ['security', 'firewall', 'encryption', 'compliance', 'authentication'].includes(tag)
        )
      );
      
      setSecurityScripts(security);
      
      // Set featured scripts (top 3 by downloads)
      setFeaturedScripts(
        [...security]
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 3)
      );
      
      // Apply filters
      let filtered = [...security];
      
      // Filter by subcategory if active
      if (activeSubcategory) {
        const subcategory = securitySubcategories.find(sub => sub.id === activeSubcategory);
        if (subcategory) {
          filtered = filtered.filter(script => 
            script.tags.some(tag => subcategory.tags.includes(tag))
          );
        }
      }
      
      // Filter by OS
      if (filterOS !== 'all') {
        filtered = filtered.filter(script => 
          script.os === filterOS || script.os === 'cross-platform'
        );
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(script => 
          script.title.toLowerCase().includes(query) ||
          script.description.toLowerCase().includes(query) ||
          script.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      filtered = sortScripts(filtered, sortOption);
      
      setFilteredScripts(filtered);
    }
  }, [allScripts, activeSubcategory, filterOS, searchQuery, sortOption]);
  
  // Sort scripts based on selected option
  const sortScripts = (scripts: any[], sortBy: SortOption): any[] => {
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
  
  // Scroll to content when changing filters
  useEffect(() => {
    if (activeSubcategory && contentRef.current) {
      // Add a small delay to allow rendering
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [activeSubcategory]);
  
  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveSubcategory(null);
    setFilterOS('all');
    setSearchQuery('');
  };
  
  // Toggle subcategory filter
  const toggleSubcategory = (subcategoryId: string) => {
    setActiveSubcategory(prev => prev === subcategoryId ? null : subcategoryId);
  };
  
  // Copy command to clipboard
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      setIsCopySuccess(true);
      setTimeout(() => setIsCopySuccess(false), 2000);
    });
  };
  
  // Quick view a script
  const handleQuickView = (scriptId: string) => {
    setActiveScript(prev => prev === scriptId ? null : scriptId);
  };
  
  // Run a security command in the terminal demo
  const runSecurityCommand = (command: string) => {
    setShowTerminal(true);
    
    // Clear previous output
    setTerminalOutput([`$ ${command}`, '']);
    
    // Simulate command execution with delay
    setTimeout(() => {
      let output: string[] = [];
      
      // Generate appropriate output based on the command
      if (command.includes('system-hardening')) {
        output = [
          'Running system hardening script...',
          '- Configuring password policies...[✓]',
          '- Setting file permissions...[✓]',
          '- Configuring firewall rules...[✓]',
          '- Updating security settings...[✓]',
          '- Creating backup...[✓]',
          'Hardening complete. System security score: 87/100'
        ];
      } else if (command.includes('iptables')) {
        output = [
          'Adding firewall rule for SSH connections...',
          'Rule added successfully.',
          'Current active rules:',
          'Chain INPUT (policy DROP)',
          'target     prot opt source               destination',
          'ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW,ESTABLISHED tcp dpt:22',
          'ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED'
        ];
      } else if (command.includes('openssl')) {
        output = [
          'Encrypting file.txt using AES-256-CBC...',
          'Enter encryption password:',
          'Verifying password:',
          'Encryption complete.',
          'Output file: file.enc'
        ];
      } else if (command.includes('pam-auth-update')) {
        output = [
          'Updating PAM configuration...',
          'Enabling multi-factor authentication...',
          'Setting up TOTP module...',
          'Configuration complete.',
          'MFA is now required for all privileged operations.'
        ];
      } else if (command.includes('auditctl')) {
        output = [
          'Setting up audit rule for password file changes...',
          'Rule added.',
          'Any write or attribute change to /etc/passwd will be logged to the audit log.'
        ];
      } else if (command.includes('incident-collector')) {
        output = [
          'Collecting forensic data...',
          '- Memory dump in progress [######################] 100%',
          '- Network captures [######################] 100%',
          '- Disk images [######################] 100%',
          'All evidence collected and stored in /forensics/',
          'SHA256 hashes generated for chain of custody.'
        ];
      } else {
        output = [
          'Command executed successfully.',
          'Output files generated.',
          'Process completed with code: 0'
        ];
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
        <title>Security Scripts | Sp1sh</title>
        <meta name="description" content="Find and use expert-verified security scripts for system hardening, firewall configuration, encryption, and security monitoring." />
        <meta name="keywords" content="security scripts, system hardening, firewall scripts, encryption tools, authentication scripts, security monitoring" />
      </Head>
      
      {/* Enhanced Hero Section with Particles Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 z-0 security-particles">
          <svg className="w-full h-full" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="securityPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 L20,10 M10,0 L10,20" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="shieldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4C51BF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0070e0" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#securityPattern)" />
          </svg>
        </div>
        
        {/* Floating security icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute text-opacity-20 text-white security-float"
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
              {i % 5 === 0 ? <FiShield /> : 
               i % 5 === 1 ? <FiLock /> : 
               i % 5 === 2 ? <FiKey /> :
               i % 5 === 3 ? <FiServer /> :
               <FiMonitor />}
            </motion.div>
          ))}
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6"
            >
              <span className="mr-2">🔒</span>
              <span>Security Scripts ({totalScriptsCount})</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary-light"
            >
              Secure Your Systems with Expert Scripts
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Discover our library of security scripts for system hardening, firewall configuration, encryption, and monitoring. All scripts are verified for effectiveness and safety.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a 
                href="#security-areas" 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Explore Security Categories
              </a>
              <Link 
                href="/add-script" 
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
              >
                Contribute a Script
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Statistics overlay */}
        {showStatistics && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="container mx-auto px-4 relative z-20 -mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {securityStatistics.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 text-white"
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-md bg-white/10 mr-3">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs">{stat.label}</div>
                    </div>
                  </div>
                  {stat.change && (
                    <div className="text-xs flex items-center mt-1">
                      {stat.trend === 'up' && <span className="text-green-400">↑</span>}
                      {stat.trend === 'down' && <span className="text-red-400">↓</span>}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
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
                <FiSearch className="text-primary" />
                Find Security Scripts
              </h2>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStatistics(!showStatistics)}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showStatistics ? 'Hide' : 'Show'} Statistics
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <EnhancedSearch 
                  placeholder="Search security scripts..."
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
                      ? 'bg-primary text-white'
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
                  <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary-light text-xs rounded-md flex items-center">
                    Category: {securitySubcategories.find(s => s.id === activeSubcategory)?.name}
                    <button 
                      onClick={() => setActiveSubcategory(null)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filterOS !== 'all' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary-light text-xs rounded-md flex items-center">
                    OS: {filterOS.charAt(0).toUpperCase() + filterOS.slice(1)}
                    <button 
                      onClick={() => setFilterOS('all')}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {searchQuery && (
                  <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary-light text-xs rounded-md flex items-center">
                    Search: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1 text-primary/70 hover:text-primary"
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
        
        {/* Featured Scripts Section */}
        {!activeSubcategory && !searchQuery && filterOS === 'all' && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiAward className="text-yellow-500" />
                Featured Security Scripts
              </h2>
              
              <Link 
                href="/categories/security/all" 
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <FiChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredScripts.map((script) => (
                <motion.div
                  key={script.id}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    {/* Featured badge */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white shadow-md">
                        <FiStar className="w-3 h-3 mr-1" /> Featured
                      </span>
                    </div>
                    <ScriptCard script={script} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
        
        {/* Security Areas Section */}
        <section id="security-areas" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiShield className="text-primary" />
              Security Areas
            </h2>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 hover:text-primary dark:hover:text-primary-light"
              >
                {showRecommendations ? 'Hide' : 'Show'} Recommendations
                {showRecommendations ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {securitySubcategories.map((subcategory) => {
              const levelStyles = getLevelStyles(subcategory.level);
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
                      ? `${levelStyles.border} border-l-4` 
                      : 'border-gray-100 dark:border-gray-700'
                  } transition-all duration-200 hover:shadow-md ${
                    isActive ? 'ring-2 ring-offset-2 ' + levelStyles.ring : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg ${levelStyles.bg} flex items-center justify-center ${levelStyles.text} mr-4`}>
                        {subcategory.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {subcategory.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelStyles.badge}`}>
                            {subcategory.level.charAt(0).toUpperCase() + subcategory.level.slice(1)}
                          </span>
                        </div>
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
                    
                    {/* Command line example */}
                    {subcategory.commandLine && (
                      <div className="relative mb-4 group">
                        <div className="bg-gray-900 text-green-400 p-2 rounded-md text-xs font-mono overflow-x-auto whitespace-nowrap">
                          <span>{subcategory.commandLine}</span>
                        </div>
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          <button
                            onClick={() => runSecurityCommand(subcategory.commandLine!)}
                            className="p-1 mr-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded"
                            title="Run command"
                          >
                            <FiTerminal size={14} />
                          </button>
                          <button
                            onClick={() => copyCommand(subcategory.commandLine!)}
                            className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded"
                            title="Copy command"
                          >
                            {isCopySuccess ? <FiCheckCircle size={14} /> : <FiCopy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {matchingScripts} scripts
                      </span>
                      
                      <button
                        onClick={() => toggleSubcategory(subcategory.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-md inline-flex items-center gap-1 ${
                          isActive
                            ? `${levelStyles.badge}`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {isActive ? 'Selected' : 'Browse Scripts'}
                        {isActive ? <FiCheckCircle className="w-3 h-3" /> : <FiChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Expandable resource links */}
                  {subcategory.resources && subcategory.resources.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-3">
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                          <span>Related Resources</span>
                          <FiChevronDown className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          {subcategory.resources.map((resource, idx) => (
                            <a 
                              key={idx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-primary dark:text-primary-light hover:underline py-1 flex items-center"
                            >
                              <FiExternalLink className="w-3 h-3 mr-1" />
                              {resource.title}
                            </a>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                  
                  {/* Show recommended practice for each subcategory if recommendations are visible */}
                  {showRecommendations && (
                    <div className={`p-4 ${levelStyles.bg} border-t border-gray-100 dark:border-gray-700`}>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <FiHelpCircle className={`w-4 h-4 ${levelStyles.text}`} />
                        </div>
                        <div>
                          <h4 className={`text-xs font-medium ${levelStyles.text} mb-1`}>
                            Best Practice
                          </h4>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {subcategory.id === 'hardening' && "Apply system hardening in stages, testing functionality after each change. Document each step for reproducibility."}
                            {subcategory.id === 'firewalls' && "Implement default-deny policies and only allow necessary services. Use stateful inspection and regularly audit rules."}
                            {subcategory.id === 'encryption' && "Use industry-standard encryption algorithms with proper key management. Rotate keys regularly and secure your key material."}
                            {subcategory.id === 'authentication' && "Enforce multi-factor authentication for all privileged accounts. Implement failed login attempt limitations and strong password policies."}
                            {subcategory.id === 'monitoring' && "Centralize security logs and implement automated alerting for critical events. Establish a baseline for normal behavior to detect anomalies."}
                            {subcategory.id === 'incident-response' && "Maintain documented incident response procedures and practice regularly. Prioritize containment to limit damage and collect evidence."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </section>
        
        {/* Interactive Terminal Demo */}
        <AnimatePresence>
          {showTerminal && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="p-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex space-x-1.5 ml-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 text-xs text-gray-400">secure-shell ~ </div>
                  </div>
                  <button 
                    onClick={() => setShowTerminal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="p-4 text-gray-200 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
                  {terminalOutput.map((line, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="whitespace-pre-wrap mb-1"
                    >
                      {line}
                    </motion.div>
                  ))}
                  <div className="animate-pulse text-green-400 mt-1">▋</div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        
        {/* Script Listing Section */}
        <div ref={contentRef}>
          {(activeSubcategory || searchQuery || filterOS !== 'all') && (
            <section className="mb-16">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {activeSubcategory 
                    ? `${securitySubcategories.find(s => s.id === activeSubcategory)?.name} Scripts` 
                    : "Security Scripts"}
                  {filteredScripts.length > 0 && ` (${filteredScripts.length})`}
                </h2>
                
                <div className="flex items-center gap-4">
                  {/* View mode selector */}
                  <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${
                        viewMode === 'grid'
                          ? 'bg-primary text-white'
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
                          ? 'bg-primary text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      aria-label="List view"
                    >
                      <FiList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 rounded ${
                        viewMode === 'compact'
                          ? 'bg-primary text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      aria-label="Compact view"
                    >
                      <FiInfo className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Sort selector */}
                  <select 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
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
                  className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                      : viewMode === 'list'
                        ? 'space-y-4'
                        : 'grid grid-cols-1 gap-2' // Compact view
                  }
                >
                  {filteredScripts.map((script) => (
                    <motion.div 
                      key={script.id}
                      variants={itemVariants}
                      whileHover={viewMode !== 'compact' ? { y: -5 } : undefined}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {viewMode === 'grid' ? (
                        <ScriptCard script={script} />
                      ) : viewMode === 'list' ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                                  <Link href={`/scripts/${script.id}`} className="hover:text-primary dark:hover:text-primary-light">
                                    {script.title}
                                  </Link>
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    script.os === 'linux' 
                                      ? 'bg-linux-green/10 text-linux-green'
                                      : script.os === 'windows'
                                        ? 'bg-windows-blue/10 text-windows-blue'
                                        : script.os === 'macos'
                                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                  }`}>
                                    {script.os === 'linux' && '🐧 '}
                                    {script.os === 'windows' && '🪟 '}
                                    {script.os === 'macos' && '🍎 '}
                                    {script.os === 'cross-platform' && '🔄 '}
                                    {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                {script.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {script.tags.slice(0, 4).map((tag) => (
                                  <span 
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {script.tags.length > 4 && (
                                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                    +{script.tags.length - 4}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-3 h-3 text-yellow-500" />
                                  {script.rating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiDownload className="w-3 h-3" />
                                  {script.downloads.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {new Date(script.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex md:flex-col gap-2 md:justify-between md:items-end">
                              <Link 
                                href={`/scripts/${script.id}`}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                              >
                                View Script
                              </Link>
                              <button 
                                onClick={() => handleQuickView(script.id)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                              >
                                {activeScript === script.id ? 'Hide Preview' : 'Quick View'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Quick view preview */}
                          <AnimatePresence>
                            {activeScript === script.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
                              >
                                <div className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm overflow-x-auto">
                                  <pre className="whitespace-pre-wrap">
                                    {script.code.length > 500 
                                      ? script.code.substring(0, 500) + '...\n\n[View full script for complete code]'
                                      : script.code}
                                  </pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        // Compact view
                        <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 p-3 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-md ${
                                script.os === 'linux' 
                                  ? 'bg-linux-green/10 text-linux-green'
                                  : script.os === 'windows'
                                    ? 'bg-windows-blue/10 text-windows-blue'
                                    : script.os === 'macos'
                                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              }`}>
                                {script.os === 'linux' && <span>🐧</span>}
                                {script.os === 'windows' && <span>🪟</span>}
                                {script.os === 'macos' && <span>🍎</span>}
                                {script.os === 'cross-platform' && <span>🔄</span>}
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                                  <Link href={`/scripts/${script.id}`} className="hover:text-primary dark:hover:text-primary-light">
                                    {script.title}
                                  </Link>
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3 mt-0.5">
                                  <span className="flex items-center gap-0.5">
                                    <FiStar className="w-3 h-3 text-yellow-500" />
                                    {script.rating.toFixed(1)}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <FiDownload className="w-3 h-3" />
                                    {script.downloads.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleQuickView(script.id)}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <FiEye size={16} />
                              </button>
                              <Link 
                                href={`/scripts/${script.id}`}
                                className="p-1.5 text-primary hover:text-primary-dark"
                              >
                                <FiExternalLink size={16} />
                              </Link>
                            </div>
                          </div>
                          
                          {/* Quick view in compact mode */}
                          <AnimatePresence>
                            {activeScript === script.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
                              >
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                  {script.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {script.tags.slice(0, 3).map((tag) => (
                                    <span 
                                      key={tag}
                                      className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {script.tags.length > 3 && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                      +{script.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                                <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
                                  <pre className="whitespace-pre-wrap">
                                    {script.code.split('\n').slice(0, 5).join('\n')}
                                    {script.code.split('\n').length > 5 ? '\n...' : ''}
                                  </pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
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
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
        
        {/* Security Resources Section (toggle visibility) */}
        <section className="mb-16">
          <button
            onClick={() => setShowResources(!showResources)}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4 mb-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiFileText className="text-primary" />
              Security Best Practices & Resources
            </h2>
            
            <span className={`transition-transform duration-200 ${showResources ? 'rotate-180' : ''}`}>
              <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
          </button>
          
          <AnimatePresence>
            {showResources && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {securityTips.map((tip, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary dark:text-primary-light flex-shrink-0">
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {tip.description}
                        </p>
                        {tip.link && (
                          <Link
                            href={tip.link}
                            className="text-xs text-primary dark:text-primary-light hover:underline inline-flex items-center"
                          >
                            Learn more <FiChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-750 p-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">Need more security guidance?</h3>
                    <div className="flex gap-3">
                      <Link 
                        href="/security-guides" 
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                      >
                        View Security Guides
                      </Link>
                      <Link 
                        href="/security-tools" 
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                      >
                        Security Tools
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        
        {/* Call to Action Section */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-r from-primary-dark to-primary rounded-xl overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/images/security-pattern.svg')] bg-repeat"></div>
            
            <div className="relative p-8 md:p-12 z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Contribute to Our Security Collection
                  </h2>
                  <p className="text-lg text-white/90 mb-6">
                    Have a valuable security script? Share it with the community and help others secure their systems.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/add-script" 
                      className="px-6 py-3 bg-white hover:bg-gray-100 text-primary font-medium rounded-md transition-colors group-hover:shadow-lg"
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
                      <FiShield className="w-16 h-16 text-white" />
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
        
        {/* Security Categories Navigation */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/categories/system-admin"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary">
                <FiServer className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">System Admin</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">System configuration & management</div>
              </div>
            </Link>
            
            <Link 
              href="/categories/networking"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-primary">
                <FiWifi className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Networking</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Network setup & troubleshooting</div>
              </div>
            </Link>
            
            <Link 
              href="/emergency"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400">
                <FiAlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Emergency</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Critical incident response scripts</div>
              </div>
            </Link>
          </div>
        </section>
      </div>
      
      {/* Custom styles for security page animations */}
      <style jsx>{`
        .security-particles {
          position: relative;
          overflow: hidden;
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .security-float {
          animation: float 15s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion) {
          .security-float {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default SecurityCategoryPage;