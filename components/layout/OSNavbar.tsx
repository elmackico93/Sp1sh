import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useScripts } from '../../context/ScriptsContext';
import { OSType } from '../../mocks/scripts';

/**
 * OSNavbar Component
 * 
 * A responsive navigation bar for different operating systems and categories.
 * Features:
 * - Responsive design for both desktop and mobile
 * - Active state highlighting for current section
 * - Collapsible menu on mobile
 * - Current section indicator on mobile
 */
export const OSNavbar = () => {
  const { currentOS, setCurrentOS } = useScripts();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check window size for mobile detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Set initial value
      checkIfMobile();
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);
      
      // Clean up
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  /**
   * Handle OS filter change
   * @param os OS type to filter by
   */
  const handleOSChange = (os: OSType | 'all') => {
    setCurrentOS(os);
    
    // If we're on a specific OS page, redirect to homepage with filter
    if (router.pathname.startsWith('/os/')) {
      router.push('/');
    }
    
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  };

  /**
   * Handle home click to set 'all' OS filter
   */
  const handleHomeClick = () => {
    setCurrentOS('all');
    
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  };

  // Check if we're on the homepage
  const isHomePage = router.pathname === '/';

  /**
   * Handle link click to close mobile menu
   */
  const handleLinkClick = () => {
    // Close mobile menu if open
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  };

  /**
   * Get current category icon and name for the mobile indicator
   */
  const getCurrentMenuInfo = () => {
    if (router.pathname === '/') {
      return { icon: '🏠', name: 'Home' };
    } else if (router.pathname.startsWith('/os/linux') || currentOS === 'linux') {
      return { icon: '🐧', name: 'Linux' };
    } else if (router.pathname.startsWith('/os/windows') || currentOS === 'windows') {
      return { icon: '🪟', name: 'Windows' };
    } else if (router.pathname.startsWith('/os/macos') || currentOS === 'macos') {
      return { icon: '🍎', name: 'macOS' };
    } else if (router.pathname.startsWith('/categories/system-admin')) {
      return { icon: '🔧', name: 'System Admin' };
    } else if (router.pathname.startsWith('/categories/security')) {
      return { icon: '🔒', name: 'Security' };
    } else if (router.pathname.startsWith('/categories/networking')) {
      return { icon: '🌐', name: 'Network' };
    } else if (router.pathname.startsWith('/emergency')) {
      return { icon: '🚨', name: 'Emergency' };
    } else if (router.pathname.startsWith('/latest')) {
      return { icon: '📊', name: 'Latest' };
    }
    return { icon: '📚', name: 'Scripts' };
  };

  const currentMenuInfo = getCurrentMenuInfo();

  return (
    <nav className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4 relative">
        {/* Mobile Header with Toggle Button and Current Category */}
        {isMobile && (
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
              aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
            >
              <span className="mr-2">{showMobileMenu ? "✕" : "☰"}</span>
              <span className="text-sm font-medium">Menu</span>
            </button>
            <div className="text-sm font-medium">
              {currentMenuInfo.icon} {currentMenuInfo.name}
            </div>
          </div>
        )}
        
        {/* No Desktop Menu Indicator - removed as requested */}
        
        {/* Desktop or Mobile Expanded Menu */}
        <ul 
          className={`${isMobile && !showMobileMenu ? 'hidden' : 'flex'} 
                    ${isMobile ? 'flex-col py-2 space-y-1' : 'items-center justify-center overflow-x-auto scrollbar-hide gap-1'}`}
        >
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link
              href="/"
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                isHomePage
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={isHomePage ? 'page' : undefined}
              onClick={handleHomeClick}
            >
              <span className="mr-2">🏠</span>
              <span>Home</span>
            </Link>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <button
              onClick={() => handleOSChange('linux')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'linux' && !isHomePage
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full text-left' : ''}`}
              aria-current={currentOS === 'linux' && !isHomePage ? 'page' : undefined}
            >
              <span className="mr-2">🐧</span>
              <span>Linux</span>
            </button>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <button
              onClick={() => handleOSChange('windows')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'windows' && !isHomePage
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full text-left' : ''}`}
              aria-current={currentOS === 'windows' && !isHomePage ? 'page' : undefined}
            >
              <span className="mr-2">🪟</span>
              <span>Windows</span>
            </button>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <button
              onClick={() => handleOSChange('macos')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'macos' && !isHomePage
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full text-left' : ''}`}
              aria-current={currentOS === 'macos' && !isHomePage ? 'page' : undefined}
            >
              <span className="mr-2">🍎</span>
              <span>macOS</span>
            </button>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link 
              href="/categories/system-admin" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                router.pathname === '/categories/system-admin'
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={router.pathname === '/categories/system-admin' ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="mr-2">🔧</span>
              <span>System Admin</span>
            </Link>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link 
              href="/categories/security" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                router.pathname === '/categories/security'
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={router.pathname === '/categories/security' ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="mr-2">🔒</span>
              <span>Security</span>
            </Link>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link 
              href="/categories/networking" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                router.pathname === '/categories/networking'
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={router.pathname === '/categories/networking' ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="mr-2">🌐</span>
              <span>Network</span>
            </Link>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link 
              href="/emergency" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                router.pathname === '/emergency'
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={router.pathname === '/emergency' ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="mr-2">🚨</span>
              <span>Emergency</span>
            </Link>
          </li>
          
          <li className={`relative ${isMobile ? 'w-full' : ''}`}>
            <Link 
              href="/latest" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                router.pathname === '/latest'
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              } ${isMobile ? 'w-full' : ''}`}
              aria-current={router.pathname === '/latest' ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <span className="mr-2">📊</span>
              <span>Latest</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};