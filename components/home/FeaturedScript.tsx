import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import { useScripts } from '../../context/ScriptsContext';

export const FeaturedScript = () => {
  const { featuredScript } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);

  // Initialize syntax highlighting
  useEffect(() => {
    if (codeRef.current && featuredScript) {
      Prism.highlightElement(codeRef.current);
    }
  }, [featuredScript]);

  if (!featuredScript) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Featured Script
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col">
          <span className="text-xs text-primary dark:text-primary-light font-semibold uppercase tracking-wider mb-2">
            Featured
          </span>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {featuredScript.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
            {featuredScript.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {featuredScript.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-primary font-medium">
                {featuredScript.authorName.substring(0, 2)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                by {featuredScript.authorUsername} · {featuredScript.downloads.toLocaleString()} downloads
              </span>
            </div>
            
            <Link
              href={`/scripts/${featuredScript.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-full transition-colors"
            >
              View Script
            </Link>
          </div>
        </div>
        
        <div className="bg-terminal-bg text-terminal-text">
          <div className="flex items-center p-3 border-b border-gray-800">
            <div className="flex gap-1.5 ml-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-3 text-xs text-gray-400">
              {featuredScript.title.toLowerCase().replace(/\s+/g, '-')}.sh
            </div>
          </div>
          
          <pre className="p-4 text-sm overflow-auto h-[300px]" ref={codeRef}>
            <code className="language-bash">
              {featuredScript.code}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default FeaturedScript;
