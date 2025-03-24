import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Script } from '../../mocks/scripts';

type ScriptCardProps = {
  script: Script;
};

export const ScriptCard = ({ script }: ScriptCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPreviewOpen && 
          previewRef.current && 
          !previewRef.current.contains(event.target as Node) &&
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)) {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPreviewOpen]);

  // Helper to determine OS badge styling
  const getOSBadgeClass = () => {
    switch (script.os) {
      case 'linux':
        return 'bg-linux-green/10 text-linux-green';
      case 'windows':
        return 'bg-windows-blue/10 text-windows-blue';
      case 'macos':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'cross-platform':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Helper to get OS icon
  const getOSIcon = () => {
    switch (script.os) {
      case 'linux':
        return '🐧';
      case 'windows':
        return '🪟';
      case 'macos':
        return '🍎';
      case 'cross-platform':
        return '🔄';
      default:
        return '💻';
    }
  };

  // Preview animation variants
  const previewVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98] 
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98] 
      }
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 relative">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 pr-16">
          {script.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{script.authorUsername}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{new Date(script.updatedAt).toLocaleDateString()}</span>
          </span>
        </div>
        
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getOSBadgeClass()}`}>
          {getOSIcon()} {script.os === 'cross-platform' ? 'Cross' : script.os}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {script.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {script.tags.slice(0, 4).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {script.tags.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
              +{script.tags.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      {/* Code Preview Section */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            ref={previewRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={previewVariants}
            className="border-t border-gray-100 dark:border-gray-700"
          >
            <div className="bg-terminal-bg text-terminal-text">
              <div className="flex items-center justify-between p-2 border-b border-gray-700">
                <div className="flex gap-1.5 ml-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-3 text-xs text-gray-400">
                  {script.title.toLowerCase().replace(/\s+/g, '-')}.sh
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>
              
              <div className="code-preview-container max-h-60 overflow-auto">
                <SyntaxHighlighter 
                  language="bash" 
                  style={tomorrow}
                  customStyle={{ margin: 0, background: 'var(--terminal-bg)' }}
                  wrapLines={true}
                  showLineNumbers={true}
                >
                  {script.code.length > 500 
                    ? script.code.substring(0, 500) + '\n\n// ... more code available in full view'
                    : script.code
                  }
                </SyntaxHighlighter>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>⭐</span>
            <span>{script.rating.toFixed(1)}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>⬇️</span>
            <span>{script.downloads.toLocaleString()}</span>
          </span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center px-3 py-1.5 ${
              isPreviewOpen
                ? 'bg-primary/90 text-white'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            } text-xs font-medium rounded-full transition-colors`}
          >
            {isPreviewOpen ? 'Hide Preview' : 'Quick View'}
          </motion.button>
          
          <Link 
            href={`/scripts/${script.id}`}
            className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-full transition-colors"
          >
            View Script
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
