import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Script } from '../../mocks/scripts';

type ScriptCardProps = {
  script: Script;
};

export const ScriptCard = ({ script }: ScriptCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the beginning of the code when preview opens
  useEffect(() => {
    if (isPreviewOpen && codeContainerRef.current) {
      // Slight delay to ensure the animation has started
      setTimeout(() => {
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isPreviewOpen]);

  // Listen for ESC key to close the preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen]);

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
  
  // Helper to determine the syntax language based on OS
  const getSyntaxLanguage = () => {
    switch (script.os) {
      case 'windows':
        return 'powershell';
      case 'linux':
      case 'macos':
      case 'cross-platform':
      default:
        return 'bash';
    }
  };
  
  // Clean up script code for display
  const formatScriptCode = () => {
    // Remove excessive blank lines
    let code = script.code.replace(/\n{3,}/g, '\n\n');
    
    // If code is too long, trim it and add a note
    if (code.length > 800) {
      // Try to find a good break point (at newline)
      const lastNewline = code.substring(0, 800).lastIndexOf('\n');
      const breakPoint = lastNewline > 700 ? lastNewline : 800;
      
      code = code.substring(0, breakPoint) + 
             '\n\n# ... additional code available in full view ...\n' +
             '# Click "View Script" to see the complete implementation';
    }
    
    return code;
  };

  // In-place animation variants
  const contentVariants = {
    visible: { opacity: 1, height: 'auto', scaleY: 1 },
    hidden: { opacity: 0, height: 0, scaleY: 0 }
  };

  // Terminal animation variants
  const terminalVariants = {
    hidden: { opacity: 0, scaleY: 0, originY: 0 },
    visible: { 
      opacity: 1, 
      scaleY: 1,
      transition: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    exit: { 
      opacity: 0,
      scaleY: 0,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  // Quick View button animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // Terminal dot animations
  const dotVariants = {
    initial: { opacity: 0.7 },
    animate: (i: number) => ({
      opacity: [0.7, 1, 0.7],
      transition: {
        delay: i * 0.2,
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    })
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
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
      
      {/* Content section - transformed into terminal when preview is open */}
      <AnimatePresence initial={false} mode="wait">
        {!isPreviewOpen ? (
          // Normal content view
          <motion.div 
            key="content" 
            ref={contentRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            className="p-4 flex-grow"
          >
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
          </motion.div>
        ) : (
          // Terminal preview (replaces normal content)
          <motion.div
            key="terminal"
            ref={previewRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={terminalVariants}
            className="flex-grow"
          >
            <div className="bg-[#1E1E1E] h-full flex flex-col"> {/* VS Code dark theme color */}
              <div className="flex items-center justify-between py-2 px-3 bg-[#252526] border-b border-[#3E3E3E]">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      custom={i}
                      variants={dotVariants}
                      initial="initial"
                      animate="animate"
                      className={`w-3 h-3 rounded-full ${
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex-1 text-center">
                  <span className="text-xs font-mono text-gray-300 truncate">
                    {script.title.toLowerCase().replace(/\s+/g, '-')}.{
                      script.os === 'windows' ? 'ps1' : 'sh'
                    }
                  </span>
                </div>
                
                <motion.button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-white p-1 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>
              
              <div 
                ref={codeContainerRef}
                className="terminal-code-container flex-grow overflow-auto"
                style={{ height: '224px' }} // Fixed height to match content area
              >
                <SyntaxHighlighter 
                  language={getSyntaxLanguage()}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#1E1E1E',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    tabSize: 2,
                    height: '100%'
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                  lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                >
                  {formatScriptCode()}
                </SyntaxHighlighter>
              </div>
              
              {/* Terminal status bar - like VS Code */}
              <div className="py-1 px-3 bg-[#007ACC] text-white text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{getSyntaxLanguage() === 'powershell' ? 'PowerShell' : 'Bash'}</span>
                  <span>•</span>
                  <span>UTF-8</span>
                </div>
                <div className="text-xs opacity-80">
                  Press ESC to close
                </div>
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
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={`inline-flex items-center px-3 py-1.5 ${
              isPreviewOpen
                ? 'bg-[#007ACC] text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            } text-xs font-medium rounded-full transition-colors`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isPreviewOpen ? "M5 15l7-7 7 7" : "M9 5l7 7-7 7"}
              />
            </svg>
            {isPreviewOpen ? 'Hide Code' : 'Quick View'}
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
