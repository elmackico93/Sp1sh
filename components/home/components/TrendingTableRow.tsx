import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Script } from '../../../mocks/scripts';

interface TrendingTableRowProps {
  script: Script;
  index: number;
  onPreviewToggle: (index: number, isOpen: boolean) => void;
  isPreviewOpen: boolean;
}

export const TrendingTableRow: React.FC<TrendingTableRowProps> = ({ 
  script, 
  index, 
  onPreviewToggle,
  isPreviewOpen
}) => {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  
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

  // Terminal animation variants
  const previewVariants = {
    hidden: { 
      opacity: 0, 
      height: 0, 
      overflow: 'hidden',
      margin: 0
    },
    visible: { 
      opacity: 1, 
      height: 'auto',
      margin: '8px 0',
      transition: { 
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, delay: 0.05 }
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      margin: 0,
      transition: { 
        height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.2 },
        margin: { duration: 0.2 }
      }
    }
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
    <>
      <tr className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
          {script.title}
        </td>
        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
          {script.os === 'cross-platform' ? 'Cross' : script.os}
        </td>
        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
          {script.category.charAt(0).toUpperCase() + script.category.slice(1).replace('-', ' ')}
        </td>
        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 text-right hidden sm:table-cell">
          {script.downloads.toLocaleString()}
        </td>
        <td className="p-4 text-sm text-gray-600 dark:text-gray-300 text-center">
          {script.rating.toFixed(1)}
        </td>
        <td className="p-4 text-center flex gap-2 justify-center">
          <button
            onClick={() => onPreviewToggle(index, !isPreviewOpen)}
            className={`inline-flex items-center justify-center px-3 py-1 ${
              isPreviewOpen 
                ? 'bg-[#007ACC] text-white shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
            } rounded-full text-xs font-medium transition-colors`}
            aria-label={isPreviewOpen ? "Hide script preview" : "Quick view script preview"}
          >
            {isPreviewOpen ? 'Hide' : 'Quick View'}
          </button>
          <Link
            href={`/scripts/${script.id}`}
            className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium transition-colors"
          >
            View
          </Link>
        </td>
      </tr>
      
      {/* Code Preview Section */}
      <tr className="border-0">
        <td colSpan={6} className="p-0">
          <AnimatePresence initial={false}>
            {isPreviewOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={previewVariants}
                className="mx-4 mb-4 rounded-lg overflow-hidden shadow-md border border-gray-700"
              >
                <div className="bg-[#1E1E1E] text-terminal-text"> {/* VS Code dark theme color */}
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
                      onClick={() => onPreviewToggle(index, false)}
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
                    className="terminal-code-container max-h-[300px] overflow-auto"
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
                        tabSize: 2
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
        </td>
      </tr>
    </>
  );
};

export default TrendingTableRow;
