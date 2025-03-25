import React, { createContext, useContext, ReactNode } from 'react';

// Define the navigation structure types
export type ThirdLevelItem = {
  name: string;
  path: string;
  icon?: string;
};

export type SecondLevelItem = {
  name: string;
  path: string;
  icon?: string;
  children?: ThirdLevelItem[];
};

export type FirstLevelItem = {
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
  // More menu items... (abbreviated for brevity, would include all items from navigationMenu)
];

// Function to find a category in the navigation menu
export const findCategoryByPath = (path: string): FirstLevelItem | SecondLevelItem | ThirdLevelItem | null => {
  // Check first level
  const firstLevel = navigationMenu.find(item => item.path === path);
  if (firstLevel) return firstLevel;
  
  // Check second level
  for (const item of navigationMenu) {
    const secondLevel = item.children.find(child => child.path === path);
    if (secondLevel) return secondLevel;
    
    // Check third level
    for (const subItem of item.children) {
      if (subItem.children) {
        const thirdLevel = subItem.children.find(child => child.path === path);
        if (thirdLevel) return thirdLevel;
      }
    }
  }
  
  return null;
};

// Function to get breadcrumbs for a path
export const getBreadcrumbs = (path: string): { name: string; path: string }[] => {
  const breadcrumbs = [{ name: 'Home', path: '/' }];
  
  // Special case for emergency
  if (path === '/emergency' || path.startsWith('/emergency/')) {
    breadcrumbs.push({ name: 'Emergency', path: '/emergency' });
    
    if (path !== '/emergency') {
      // Look for subcategory
      const emergencySection = navigationMenu.find(item => item.path === '/emergency');
      if (emergencySection) {
        const subSection = emergencySection.children.find(child => 
          path === child.path || path.startsWith(`${child.path}/`)
        );
        
        if (subSection) {
          breadcrumbs.push({ name: subSection.name, path: subSection.path });
          
          // Check for third level
          if (path !== subSection.path && subSection.children) {
            const thirdLevel = subSection.children.find(child => path === child.path);
            if (thirdLevel) {
              breadcrumbs.push({ name: thirdLevel.name, path: thirdLevel.path });
            }
          }
        }
      }
    }
    
    return breadcrumbs;
  }
  
  // Regular categories
  if (path.startsWith('/categories/')) {
    const pathParts = path.split('/').filter(Boolean);
    
    // Add category
    if (pathParts.length >= 2) {
      const category = navigationMenu.find(item => 
        item.path === `/categories/${pathParts[1]}`
      );
      
      if (category) {
        breadcrumbs.push({ name: category.name, path: category.path });
        
        // Add subcategory
        if (pathParts.length >= 3) {
          const subcategory = category.children.find(child => 
            child.path === `/categories/${pathParts[1]}/${pathParts[2]}`
          );
          
          if (subcategory) {
            breadcrumbs.push({ name: subcategory.name, path: subcategory.path });
            
            // Add third level
            if (pathParts.length >= 4 && subcategory.children) {
              const thirdLevel = subcategory.children.find(child => 
                child.path === `/categories/${pathParts[1]}/${pathParts[2]}/${pathParts[3]}`
              );
              
              if (thirdLevel) {
                breadcrumbs.push({ name: thirdLevel.name, path: thirdLevel.path });
              }
            }
          }
        }
      }
    }
  }
  
  return breadcrumbs;
};

// Create the context
type NavigationContextType = {
  navigationMenu: FirstLevelItem[];
  findCategoryByPath: (path: string) => FirstLevelItem | SecondLevelItem | ThirdLevelItem | null;
  getBreadcrumbs: (path: string) => { name: string; path: string }[];
};

const NavigationContext = createContext<NavigationContextType>({
  navigationMenu,
  findCategoryByPath,
  getBreadcrumbs
});

// Create provider component
export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NavigationContext.Provider value={{ navigationMenu, findCategoryByPath, getBreadcrumbs }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for using the navigation context
export const useNavigation = () => useContext(NavigationContext);