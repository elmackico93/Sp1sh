import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { HeaderSearch } from '../search/HeaderSearch';

export const Header = () => {
  const { setSearchTerm } = useScripts();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const claims = [
    '> Scripts that automate the world',
    '> Your terminal. Supercharged.',
    '> Deploy. Fix. Repeat.',
    '> One-liners that win wars',
    '> Code. Automate. Dominate.',
    '> Instant power. No fluff.',
    '> Shell mastery, simplified',
    '> Secure. Fast. Reliable.',
    '> System wisdom in a click',
    '> Click, code, conquer.'
  ];

  const [claimIndex, setClaimIndex] = useState(0);
  const [animatedClaim, setAnimatedClaim] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize text animation when component mounts or claim changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsTyping(true);
    const full = claims[claimIndex];
    let current = '';
    let i = 0;

    // Make cursor visible during typing
    const cursor = document.getElementById('cursor');
    if (cursor) cursor.style.opacity = '1';

    const interval = setInterval(() => {
      if (i >= full.length) {
        clearInterval(interval);
        setIsTyping(false);
        return;
      }
      
      current += full[i];
      setAnimatedClaim(current);
      i++;
    }, 60); // Slightly slower for more reliability

    return () => clearInterval(interval);
  }, [claimIndex]);

  // Handle cursor blinking - should only blink when typing is complete
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    if (isTyping) {
      // Keep cursor visible and solid during typing
      cursor.style.opacity = '1';
      cursor.style.animation = 'none';
    } else {
      // Start blinking after typing is complete
      cursor.style.animation = 'blink 1s step-end infinite';
    }
  }, [isTyping]);

  const rotateClaim = () => {
    if (isTyping) return; // Prevent changing during typing animation
    setClaimIndex((prev) => (prev + 1) % claims.length);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm backdrop-blur-lg dark:shadow-gray-800/10 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={rotateClaim} className="flex items-center gap-3 mt-2 sm:mt-3 mb-2 sm:mb-3 focus:outline-none">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/assets/logo.svg"
                alt="Sp1sh Logo"
                className="h-12 sm:h-14 w-auto bg-white dark:bg-gray-900 rounded-2xl p-1 ring-2 ring-primary drop-shadow-md transition-transform duration-200 hover:scale-110"
                loading="eager"
              />
            </div>
            <span
              className="font-mono text-sm sm:text-[13px] text-blue-500 dark:text-primary-light opacity-100 select-none flex items-center justify-start"
              style={{ minWidth: '34ch', maxWidth: '34ch' }}
            >
              <span
                id="typed-claim"
                className="whitespace-nowrap text-left block"
              >
                {animatedClaim}
              </span>
              <span id="cursor" className="cursor">|</span>
            </span>
          </div>
        </button>

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <HeaderSearch />
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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 shadow-md">
          <div className="mb-4">
            <HeaderSearch />
          </div>

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

export default Header;