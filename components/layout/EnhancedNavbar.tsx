import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import type { OSType } from '../../mocks/scripts';

// Define the navigation menu structure types
type ThirdLevelItem = {
  name: string;
  path: string;
  icon?: string;
};

type SecondLevelItem = {
  name: string;
  path: string;
  icon?: string;
  children?: ThirdLevelItem[];
};

type FirstLevelItem = {
  name: string;
  path: string;
  icon: string;
  children: SecondLevelItem[];
};

// Menu structure based on paste.txt
export const navigationMenu: FirstLevelItem[] = [
  {
    name: 'System Admin',
    path: '/categories/system-admin',
    icon: '🖥️',
    children: [
      {
        name: 'Users & Permissions',
        path: '/categories/system-admin/users-permissions',
        icon: '👥',
        children: [
          { name: 'Linux User Management', path: '/categories/system-admin/users-permissions/linux-user-management' },
          { name: 'Active Directory Users', path: '/categories/system-admin/users-permissions/active-directory-users' },
          { name: 'Bulk Password Reset', path: '/categories/system-admin/users-permissions/bulk-password-reset' }
        ]
      },
      {
        name: 'Updates & Patching',
        path: '/categories/system-admin/updates-patching',
        icon: '🔄',
        children: [
          { name: 'Linux Updates Automation', path: '/categories/system-admin/updates-patching/linux-updates-automation' },
          { name: 'Windows Updates Automation', path: '/categories/system-admin/updates-patching/windows-updates-automation' },
          { name: 'Patch Status Reports', path: '/categories/system-admin/updates-patching/patch-status-reports' }
        ]
      },
      {
        name: 'File & Local Backup',
        path: '/categories/system-admin/file-local-backup',
        icon: '💾',
        children: [
          { name: 'Incremental Backup (rsync)', path: '/categories/system-admin/file-local-backup/incremental-backup' },
          { name: 'Windows Backup Scripts', path: '/categories/system-admin/file-local-backup/windows-backup-scripts' },
          { name: 'Cleanup Temporary Files', path: '/categories/system-admin/file-local-backup/cleanup-temp-files' }
        ]
      },
      {
        name: 'Processes & Services',
        path: '/categories/system-admin/processes-services',
        icon: '⚙️',
        children: [
          { name: 'Linux Service Watchdog', path: '/categories/system-admin/processes-services/linux-service-watchdog' },
          { name: 'Windows Service Monitoring', path: '/categories/system-admin/processes-services/windows-service-monitoring' },
          { name: 'Automated Task Scheduler', path: '/categories/system-admin/processes-services/automated-task-scheduler' }
        ]
      }
    ]
  },
  {
    name: 'Security',
    path: '/categories/security',
    icon: '🔒',
    children: [
      {
        name: 'Hardening',
        path: '/categories/security/hardening',
        icon: '🛡️',
        children: [
          { name: 'Linux Server Hardening', path: '/categories/security/hardening/linux-server-hardening' },
          { name: 'Windows Server Hardening', path: '/categories/security/hardening/windows-server-hardening' },
          { name: 'Disable Unnecessary Services', path: '/categories/security/hardening/disable-unnecessary-services' }
        ]
      },
      {
        name: 'Firewall & IPS',
        path: '/categories/security/firewall-ips',
        icon: '🧱',
        children: [
          { name: 'Linux Firewall (iptables)', path: '/categories/security/firewall-ips/linux-firewall' },
          { name: 'Windows Firewall Management', path: '/categories/security/firewall-ips/windows-firewall' },
          { name: 'Open Ports Scanning', path: '/categories/security/firewall-ips/open-ports-scanning' }
        ]
      },
      {
        name: 'Auditing & Compliance',
        path: '/categories/security/auditing-compliance',
        icon: '📋',
        children: [
          { name: 'Password Audit', path: '/categories/security/auditing-compliance/password-audit' },
          { name: 'Critical File Integrity', path: '/categories/security/auditing-compliance/file-integrity' },
          { name: 'Compliance Reporting', path: '/categories/security/auditing-compliance/compliance-reporting' }
        ]
      }
    ]
  },
  {
    name: 'Network',
    path: '/categories/network',
    icon: '📡',
    children: [
      {
        name: 'Network Setup & IP',
        path: '/categories/network/setup-ip',
        icon: '🌐',
        children: [
          { name: 'Linux Network Configuration', path: '/categories/network/setup-ip/linux-network-config' },
          { name: 'Windows Network Configuration', path: '/categories/network/setup-ip/windows-network-config' },
          { name: 'VLAN & Routing Automation', path: '/categories/network/setup-ip/vlan-routing-automation' }
        ]
      },
      {
        name: 'Diagnostics & Tools',
        path: '/categories/network/diagnostics-tools',
        icon: '🔍',
        children: [
          { name: 'Multi-host Ping & Latency', path: '/categories/network/diagnostics-tools/multi-host-ping' },
          { name: 'Automated Traceroute', path: '/categories/network/diagnostics-tools/automated-traceroute' },
          { name: 'Port & Service Checks', path: '/categories/network/diagnostics-tools/port-service-checks' }
        ]
      },
      {
        name: 'DNS & DHCP',
        path: '/categories/network/dns-dhcp',
        icon: '🏷️',
        children: [
          { name: 'DNS Resolution Testing', path: '/categories/network/dns-dhcp/dns-resolution-testing' },
          { name: 'DNS Records Automation', path: '/categories/network/dns-dhcp/dns-records-automation' },
          { name: 'Dynamic DNS Scripts', path: '/categories/network/dns-dhcp/dynamic-dns-scripts' }
        ]
      }
    ]
  },
  {
    name: 'Cloud & Containers',
    path: '/categories/cloud-containers',
    icon: '☁️',
    children: [
      {
        name: 'AWS Automation',
        path: '/categories/cloud-containers/aws-automation',
        icon: '☁️',
        children: [
          { name: 'EC2 Management Scripts', path: '/categories/cloud-containers/aws-automation/ec2-management' },
          { name: 'S3 Automated Backup', path: '/categories/cloud-containers/aws-automation/s3-backup' },
          { name: 'IAM User Management', path: '/categories/cloud-containers/aws-automation/iam-user-management' }
        ]
      },
      {
        name: 'Azure Automation',
        path: '/categories/cloud-containers/azure-automation',
        icon: '☁️',
        children: [
          { name: 'Azure VM Provisioning', path: '/categories/cloud-containers/azure-automation/vm-provisioning' },
          { name: 'Azure AD Automation', path: '/categories/cloud-containers/azure-automation/ad-automation' },
          { name: 'Azure Backup & Snapshots', path: '/categories/cloud-containers/azure-automation/backup-snapshots' }
        ]
      },
      {
        name: 'Google Cloud Automation',
        path: '/categories/cloud-containers/gcp-automation',
        icon: '☁️',
        children: [
          { name: 'Compute Engine Automation', path: '/categories/cloud-containers/gcp-automation/compute-engine' },
          { name: 'Kubernetes (GKE) Automation', path: '/categories/cloud-containers/gcp-automation/gke-automation' },
          { name: 'Cloud Storage Tools', path: '/categories/cloud-containers/gcp-automation/cloud-storage' }
        ]
      },
      {
        name: 'Kubernetes & Docker',
        path: '/categories/cloud-containers/kubernetes-docker',
        icon: '🐳',
        children: [
          { name: 'Docker Environment Setup', path: '/categories/cloud-containers/kubernetes-docker/docker-setup' },
          { name: 'Kubernetes Maintenance', path: '/categories/cloud-containers/kubernetes-docker/kubernetes-maintenance' },
          { name: 'Container Cleanup Scripts', path: '/categories/cloud-containers/kubernetes-docker/container-cleanup' }
        ]
      }
    ]
  },
  {
    name: 'Emergency',
    path: '/emergency',
    icon: '🚨',
    children: [
      {
        name: 'Incident Response',
        path: '/emergency/incident-response',
        icon: '🆘',
        children: [
          { name: 'Log & Evidence Collection', path: '/emergency/incident-response/log-evidence-collection' },
          { name: 'Host Isolation Tools', path: '/emergency/incident-response/host-isolation' },
          { name: 'IP Blocking Scripts', path: '/emergency/incident-response/ip-blocking' }
        ]
      },
      {
        name: 'Forensics Analysis',
        path: '/emergency/forensics',
        icon: '🔍',
        children: [
          { name: 'Memory Dumping', path: '/emergency/forensics/memory-dumping' },
          { name: 'IOC Scanning', path: '/emergency/forensics/ioc-scanning' },
          { name: 'Automated Forensics Reports', path: '/emergency/forensics/automated-reports' }
        ]
      },
      {
        name: 'Disaster Recovery',
        path: '/emergency/disaster-recovery',
        icon: '🔄',
        children: [
          { name: 'File Recovery from Backup', path: '/emergency/disaster-recovery/file-recovery' },
          { name: 'Linux Disaster Recovery', path: '/emergency/disaster-recovery/linux-recovery' },
          { name: 'Active Directory Recovery', path: '/emergency/disaster-recovery/ad-recovery' }
        ]
      }
    ]
  },
  {
    name: 'DevOps & CI/CD',
    path: '/categories/devops-cicd',
    icon: '⚙️',
    children: [
      {
        name: 'Continuous Integration (CI)',
        path: '/categories/devops-cicd/continuous-integration',
        icon: '🔄',
        children: [
          { name: 'Cross-platform Build Scripts', path: '/categories/devops-cicd/continuous-integration/cross-platform-build' },
          { name: 'Automated Code Analysis', path: '/categories/devops-cicd/continuous-integration/code-analysis' },
          { name: 'Git Hooks Automation', path: '/categories/devops-cicd/continuous-integration/git-hooks' }
        ]
      },
      {
        name: 'Continuous Delivery (CD)',
        path: '/categories/devops-cicd/continuous-delivery',
        icon: '🚀',
        children: [
          { name: 'Linux Application Deployment', path: '/categories/devops-cicd/continuous-delivery/linux-deployment' },
          { name: 'Windows Deployment Scripts', path: '/categories/devops-cicd/continuous-delivery/windows-deployment' },
          { name: 'Automated Rollbacks', path: '/categories/devops-cicd/continuous-delivery/automated-rollbacks' }
        ]
      },
      {
        name: 'Container Management',
        path: '/categories/devops-cicd/container-management',
        icon: '🐳',
        children: [
          { name: 'Docker Image Build Automation', path: '/categories/devops-cicd/container-management/docker-build' },
          { name: 'Kubernetes Deployment Scripts', path: '/categories/devops-cicd/container-management/kubernetes-deployment' },
          { name: 'Container Scaling Tools', path: '/categories/devops-cicd/container-management/container-scaling' }
        ]
      }
    ]
  },
  {
    name: 'Automation',
    path: '/categories/automation',
    icon: '🚀',
    children: [
      {
        name: 'Scheduled Tasks',
        path: '/categories/automation/scheduled-tasks',
        icon: '⏰',
        children: [
          { name: 'Linux Cron Jobs', path: '/categories/automation/scheduled-tasks/linux-cron' },
          { name: 'Windows Scheduled Tasks', path: '/categories/automation/scheduled-tasks/windows-scheduled-tasks' },
          { name: 'Automatic Cleanup', path: '/categories/automation/scheduled-tasks/automatic-cleanup' }
        ]
      },
      {
        name: 'Automated Backups',
        path: '/categories/automation/automated-backups',
        icon: '💾',
        children: [
          { name: 'Database Backups', path: '/categories/automation/automated-backups/database-backups' },
          { name: 'Directory Sync Scripts', path: '/categories/automation/automated-backups/directory-sync' },
          { name: 'Cloud Backup Upload', path: '/categories/automation/automated-backups/cloud-backup' }
        ]
      },
      {
        name: 'Monitoring Automation',
        path: '/categories/automation/monitoring',
        icon: '📊',
        children: [
          { name: 'System Resource Monitoring', path: '/categories/automation/monitoring/system-resources' },
          { name: 'Log Analysis Tools', path: '/categories/automation/monitoring/log-analysis' },
          { name: 'Service Health Alerting', path: '/categories/automation/monitoring/service-health' }
        ]
      }
    ]
  },
  {
    name: 'Dev Tools',
    path: '/categories/dev-tools',
    icon: '🛠️',
    children: [
      {
        name: 'Environment Setup',
        path: '/categories/dev-tools/environment-setup',
        icon: '💻',
        children: [
          { name: 'Linux/macOS Dev Environment', path: '/categories/dev-tools/environment-setup/linux-macos-env' },
          { name: 'Windows Dev Environment', path: '/categories/dev-tools/environment-setup/windows-env' },
          { name: 'Dotfiles Setup Automation', path: '/categories/dev-tools/environment-setup/dotfiles-setup' }
        ]
      },
      {
        name: 'Workflow & Git',
        path: '/categories/dev-tools/workflow-git',
        icon: '🔄',
        children: [
          { name: 'Custom Git Hooks', path: '/categories/dev-tools/workflow-git/custom-git-hooks' },
          { name: 'Local Test Deployments', path: '/categories/dev-tools/workflow-git/local-test-deployments' },
          { name: 'Automated Test Runner', path: '/categories/dev-tools/workflow-git/automated-test-runner' }
        ]
      },
      {
        name: 'Developer Utilities',
        path: '/categories/dev-tools/utilities',
        icon: '🔧',
        children: [
          { name: 'Batch File Conversions', path: '/categories/dev-tools/utilities/batch-file-conversions' },
          { name: 'CLI Timers & Reminders', path: '/categories/dev-tools/utilities/cli-timers' },
          { name: 'Personal Backup Scripts', path: '/categories/dev-tools/utilities/personal-backup' }
        ]
      }
    ]
  },
  {
    name: 'Beginners',
    path: '/categories/beginners',
    icon: '📚',
    children: [
      {
        name: 'Bash Basics',
        path: '/categories/beginners/bash-basics',
        icon: '🐧',
        children: [
          { name: 'Hello World & Variables', path: '/categories/beginners/bash-basics/hello-world-variables' },
          { name: 'File & Folder Operations', path: '/categories/beginners/bash-basics/file-folder-operations' },
          { name: 'Simple Backup Script', path: '/categories/beginners/bash-basics/simple-backup' }
        ]
      },
      {
        name: 'PowerShell Basics',
        path: '/categories/beginners/powershell-basics',
        icon: '🪟',
        children: [
          { name: 'Cmdlets & Pipelines', path: '/categories/beginners/powershell-basics/cmdlets-pipelines' },
          { name: 'File & Folder Management', path: '/categories/beginners/powershell-basics/file-folder-management' },
          { name: 'Simple System Reports', path: '/categories/beginners/powershell-basics/simple-system-reports' }
        ]
      },
      {
        name: 'Ready-to-use Scripts',
        path: '/categories/beginners/ready-to-use',
        icon: '📜',
        children: [
          { name: 'CLI Calculator', path: '/categories/beginners/ready-to-use/cli-calculator' },
          { name: 'Image Batch Converter', path: '/categories/beginners/ready-to-use/image-batch-converter' },
          { name: 'Simple Timer Script', path: '/categories/beginners/ready-to-use/simple-timer' }
        ]
      }
    ]
  }
];

// Function to extract the base category from a path
const extractCategory = (path: string): string => {
  // Handle special case for emergency path
  if (path === '/emergency' || path.startsWith('/emergency/')) {
    return '/emergency';
  }
  
  const pathParts = path.split('/');
  if (pathParts.length >= 3 && pathParts[1] === 'categories') {
    return `/categories/${pathParts[2]}`;
  }
  
  return path;
};

export const EnhancedNavbar: React.FC = () => {
  const router = useRouter();
  const { currentOS, setCurrentOS } = useScripts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<string>>(new Set());
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initialize
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Set active category based on current route
  useEffect(() => {
    const category = extractCategory(router.pathname);
    setActiveCategory(category);
  }, [router.pathname]);

  // Handle menu hover events with delay
  const handleMenuEnter = (categoryPath: string) => {
    if (isMobile) return;
    
    // Clear any existing timeout
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    
    // Set a short delay before showing menu
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(categoryPath);
    }, 100);
  };

  const handleMenuLeave = () => {
    if (isMobile) return;
    
    // Clear any existing timeout
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    
    // Set a delay before hiding menu
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  // Handle submenu hover events with delay
  const handleSubmenuEnter = (submenuPath: string) => {
    if (isMobile) return;
    
    // Clear any existing timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    
    submenuTimeoutRef.current = setTimeout(() => {
      setHoveredSubmenu(submenuPath);
    }, 100);
  };

  const handleSubmenuLeave = () => {
    if (isMobile) return;
    
    // Clear any existing timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    
    submenuTimeoutRef.current = setTimeout(() => {
      setHoveredSubmenu(null);
    }, 300);
  };

  // Toggle mobile menu item expansion
  const toggleMobileExpand = (categoryPath: string) => {
    setExpandedMobileItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryPath)) {
        newSet.delete(categoryPath);
      } else {
        newSet.add(categoryPath);
      }
      return newSet;
    });
  };

  // Animation variants for dropdown menus
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -5,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -5,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for submenu
  const submenuVariants = {
    hidden: { 
      opacity: 0, 
      x: -5,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      x: -5,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <nav className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto relative">
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center justify-between py-3 px-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span className="mr-2">{mobileMenuOpen ? "✕" : "☰"}</span>
              <span className="text-sm font-medium">Menu</span>
            </button>
            <div className="text-sm font-medium">
              {activeCategory ? 
                navigationMenu.find(item => item.path === activeCategory)?.name || 'Home' : 
                'Home'}
            </div>
          </div>
        )}
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <ul className="flex items-center justify-center overflow-x-auto scrollbar-hide gap-1 py-1">
            <li className="relative">
              <Link
                href="/"
                className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                  router.pathname === '/'
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                aria-current={router.pathname === '/' ? 'page' : undefined}
              >
                <span className="mr-2">🏠</span>
                <span>Home</span>
              </Link>
            </li>
            
            {navigationMenu.map((item) => (
              <li 
                key={item.path} 
                className="relative"
                onMouseEnter={() => handleMenuEnter(item.path)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.path}
                  className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                    activeCategory === item.path
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  aria-current={activeCategory === item.path ? 'page' : undefined}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                  <FiChevronDown className="ml-1 w-4 h-4" />
                </Link>
                
                {/* First Level Dropdown */}
                <AnimatePresence>
                  {hoveredCategory === item.path && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50"
                      onMouseEnter={() => setHoveredCategory(item.path)}
                      onMouseLeave={handleMenuLeave}
                    >
                      <div className="py-2">
                        {item.children.map((subItem) => (
                          <div 
                            key={subItem.path}
                            className="relative"
                            onMouseEnter={() => handleSubmenuEnter(subItem.path)}
                            onMouseLeave={handleSubmenuLeave}
                          >
                            <Link
                              href={subItem.path}
                              className={`flex items-center justify-between px-4 py-2 text-sm ${
                                router.pathname.startsWith(subItem.path)
                                  ? 'text-primary bg-primary/5 font-medium'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center">
                                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                                <span>{subItem.name}</span>
                              </div>
                              {subItem.children && <FiChevronRight className="w-4 h-4" />}
                            </Link>
                            
                            {/* Second Level Dropdown (Third Level Items) */}
                            <AnimatePresence>
                              {hoveredSubmenu === subItem.path && subItem.children && (
                                <motion.div
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={submenuVariants}
                                  className="absolute left-full top-0 ml-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-50"
                                  onMouseEnter={() => setHoveredSubmenu(subItem.path)}
                                  onMouseLeave={handleSubmenuLeave}
                                >
                                  <div className="py-2">
                                    {subItem.children.map((thirdItem) => (
                                      <Link
                                        key={thirdItem.path}
                                        href={thirdItem.path}
                                        className={`block px-4 py-2 text-sm ${
                                          router.pathname === thirdItem.path
                                            ? 'text-primary bg-primary/5 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                      >
                                        {thirdItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
        
        {/* Mobile Navigation Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden border-x border-b border-gray-100 dark:border-gray-700 absolute top-full left-0 right-0 z-50">
            <div className="max-h-[70vh] overflow-y-auto pt-2 pb-4">
              <Link
                href="/"
                className={`flex items-center py-3 px-4 text-sm font-medium ${
                  router.pathname === '/'
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">🏠</span>
                <span>Home</span>
              </Link>
              
              {navigationMenu.map((item) => (
                <div key={item.path}>
                  <div
                    className={`flex items-center justify-between py-3 px-4 text-sm font-medium cursor-pointer ${
                      activeCategory === item.path
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => toggleMobileExpand(item.path)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="transform transition-transform duration-200">
                      {expandedMobileItems.has(item.path) ? (
                        <FiChevronDown className="w-5 h-5" />
                      ) : (
                        <FiChevronRight className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                  
                  {/* First Level Submenu (Mobile) */}
                  {expandedMobileItems.has(item.path) && (
                    <div className="pl-6 pr-2 bg-gray-50 dark:bg-gray-750">
                      {item.children.map((subItem) => (
                        <div key={subItem.path}>
                          <div
                            className={`flex items-center justify-between py-3 px-4 text-sm font-medium cursor-pointer ${
                              router.pathname.startsWith(subItem.path)
                                ? 'text-primary'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                            onClick={() => toggleMobileExpand(subItem.path)}
                          >
                            <div className="flex items-center">
                              {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                              <span>{subItem.name}</span>
                            </div>
                            {subItem.children && (
                              <span className="transform transition-transform duration-200">
                                {expandedMobileItems.has(subItem.path) ? (
                                  <FiChevronDown className="w-4 h-4" />
                                ) : (
                                  <FiChevronRight className="w-4 h-4" />
                                )}
                              </span>
                            )}
                          </div>
                          
                          {/* Second Level Submenu (Mobile) */}
                          {expandedMobileItems.has(subItem.path) && subItem.children && (
                            <div className="pl-6 pr-2 bg-gray-100 dark:bg-gray-700 rounded-md my-1">
                              {subItem.children.map((thirdItem) => (
                                <Link
                                  key={thirdItem.path}
                                  href={thirdItem.path}
                                  className={`block py-2 px-4 text-sm ${
                                    router.pathname === thirdItem.path
                                      ? 'text-primary font-medium'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {thirdItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavbar;