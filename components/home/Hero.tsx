import React from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../context/ScriptsContext';
import { EnhancedSearch } from '../search/EnhancedSearch';

export const Hero = () => {
  const { setSearchTerm } = useScripts();
  const router = useRouter();

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none bg-grid-pattern"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10" style={{ overflow: 'visible' }}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
          Shell Script Solutions <span className="text-primary dark:text-primary-light">Simplified</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Find, use, and share expert-vetted shell scripts for Linux, Windows, and macOS. Organized by need, urgency, and use case.
        </p>
        
        <div className="max-w-2xl mx-auto relative" style={{ overflow: 'visible' }}>
          {/* Apply custom styling to the EnhancedSearch component */}
          <div className="hero-search-wrapper" style={{ position: 'relative', zIndex: 50 }}>
            <EnhancedSearch 
              placeholder="Search for scripts, system tasks, or troubleshooting..."
              maxResults={8}
              className="hero-search"
            />
            
            {/* Add the search button overlay to maintain the original visual style */}
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 md:px-6 rounded-full text-sm md:text-base transition-colors"
              onClick={() => {
                const inputEl = document.querySelector('.hero-search input') as HTMLInputElement;
                if (inputEl && inputEl.value) {
                  setSearchTerm(inputEl.value);
                  router.push({
                    pathname: '/',
                    query: { search: inputEl.value }
                  }, undefined, { shallow: true });
                }
              }}
            >
              Search
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <div className="inline-flex items-center px-3 py-2 bg-linux-green bg-opacity-10 text-linux-green rounded-full text-sm font-medium border border-linux-green border-opacity-20">
            <span className="mr-2">🐧</span>
            <span>Linux Scripts</span>
          </div>
          
          <div className="inline-flex items-center px-3 py-2 bg-windows-blue bg-opacity-10 text-windows-blue rounded-full text-sm font-medium border border-windows-blue border-opacity-20">
            <span className="mr-2">🪟</span>
            <span>Windows PowerShell</span>
          </div>
          
          <div className="inline-flex items-center px-3 py-2 bg-black bg-opacity-5 text-gray-900 dark:text-gray-100 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
            <span className="mr-2">🍎</span>
            <span>macOS Scripts</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;