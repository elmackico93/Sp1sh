import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';

export const Header = () => {
  const { setSearchTerm } = useScripts();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    
    // If not on homepage, redirect to homepage with search
    if (router.pathname !== '/') {
      router.push({
        pathname: '/',
        query: { search: searchValue }
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm backdrop-blur-lg dark:shadow-gray-800/10 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" passHref className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <span className="text-2xl">⌨️</span>
          <span>Sp1sh</span>
        </Link>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              placeholder="Search for scripts, commands, or solutions..."
              className="w-full py-2 pl-10 pr-4 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              🔍
            </span>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mounted && theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </button>
          
          <Link href="/signin" className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light">
            Sign In
          </Link>
          
          <Link href="/add-script" className="hidden md:flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors">
            <span>+</span>
            <span>Add Script</span>
          </Link>
          
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 shadow-md">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              placeholder="Search scripts..."
              className="w-full py-2 px-4 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
          
          <div className="flex flex-col space-y-2">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              Sign In
            </Link>
            <Link
              href="/add-script"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md"
            >
              Add Script
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
