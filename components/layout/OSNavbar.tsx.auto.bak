import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useScripts } from '../../context/ScriptsContext';
import { OSType, ScriptCategory } from '../../mocks/scripts';

export const OSNavbar = () => {
  const { currentOS, setCurrentOS } = useScripts();
  const router = useRouter();

  const handleOSChange = (os: OSType | 'all') => {
    setCurrentOS(os);
    
    // If we're on a specific OS page, redirect to homepage with filter
    if (router.pathname.startsWith('/os/')) {
      router.push('/');
    }
  };

  return (
    <nav className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex items-center overflow-x-auto scrollbar-hide gap-1">
          <li className="relative">
            <button
              onClick={() => handleOSChange('all')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'all' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={currentOS === 'all' ? 'page' : undefined}
            >
              <span>All Scripts</span>
            </button>
          </li>
          
          <li className="relative">
            <button
              onClick={() => handleOSChange('linux')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'linux' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={currentOS === 'linux' ? 'page' : undefined}
            >
              <span className="mr-2">🐧</span>
              <span>Linux</span>
            </button>
          </li>
          
          <li className="relative">
            <button
              onClick={() => handleOSChange('windows')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'windows' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={currentOS === 'windows' ? 'page' : undefined}
            >
              <span className="mr-2">🪟</span>
              <span>Windows</span>
            </button>
          </li>
          
          <li className="relative">
            <button
              onClick={() => handleOSChange('macos')}
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap ${
                currentOS === 'macos' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              aria-current={currentOS === 'macos' ? 'page' : undefined}
            >
              <span className="mr-2">🍎</span>
              <span>macOS</span>
            </button>
          </li>
          
          <li className="relative">
            <Link href="/categories/system-admin" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
            >
              <span className="mr-2">🔧</span>
              <span>System Admin</span>
            </Link>
          </li>
          
          <li className="relative">
            <Link href="/categories/security" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
            >
              <span className="mr-2">🔒</span>
              <span>Security</span>
            </Link>
          </li>
          
          <li className="relative">
            <Link href="/categories/networking" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
            >
              <span className="mr-2">🌐</span>
              <span>Network</span>
            </Link>
          </li>
          
          <li className="relative">
            <Link href="/emergency" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
            >
              <span className="mr-2">🚨</span>
              <span>Emergency</span>
            </Link>
          </li>
          
          <li className="relative">
            <Link href="/latest" 
              className={`flex items-center py-3 px-3 text-sm font-medium whitespace-nowrap text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200`}
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
