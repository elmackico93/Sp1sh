import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Script } from '../../mocks/scripts';
import { TerminalAnimation } from './TerminalAnimation';

interface DownloadModalProps {
  script: Script;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  script,
  isOpen,
  onClose,
  onDownload,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAnimation(false);
      setTypedLines([]);
      setTypingComplete(false);
    } else if (!showAnimation && typedLines.length === 0) {
      // Initialize typing effect for initial terminal preview
      typeInitialLines();
    }
  }, [isOpen]);

  // Type initial terminal lines with a realistic effect
  const typeInitialLines = () => {
    const filename = `${script.title.toLowerCase().replace(/\s+/g, '-')}.${script.os === 'windows' ? 'ps1' : 'sh'}`;
    const lines = [
      `user@sp1sh:~$ ls -la ${script.category}`,
      `total 16`,
      `drwxr-xr-x  2 user group  4096 ${new Date(script.updatedAt).toLocaleDateString()} .`,
      `drwxr-xr-x 24 user group  4096 Mar 24 2025 ..`,
      `-rwxr--r--  1 user group  4.2K ${new Date(script.updatedAt).toLocaleDateString()} ${filename}`,
      `user@sp1sh:~$ file ${filename}`,
      `${filename}: Bourne-Again shell script, ASCII text executable`,
      `user@sp1sh:~$ cat ${filename} | head -n 3`,
      `#!/bin/bash`,
      `# ${script.title}`,
      `# Author: ${script.authorUsername}`,
      `user@sp1sh:~$ _`
    ];

    let currentIndex = 0;
    const addNextLine = () => {
      if (currentIndex < lines.length) {
        const line = lines[currentIndex];
        setTypedLines(prev => [...prev, line]);
        currentIndex++;
        
        // Variable typing speed based on line content
        const delay = line.startsWith('user@sp1sh') ? 
          300 + Math.random() * 200 : 
          150 + Math.random() * 100;
          
        setTimeout(addNextLine, delay);
      } else {
        // Mark typing as complete to trigger button animation
        setTypingComplete(true);
      }
    };
    
    // Start typing effect
    setTimeout(addNextLine, 300);
  };

  // Close modal when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleStartAnimation = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    onDownload();
  };

  // Generate colorized output for ls command
  const colorizeOutput = (line: string) => {
    if (line.startsWith('drwx')) {
      return <span className="text-blue-400">{line}</span>;
    } else if (line.startsWith('-rwx')) {
      return <span className="text-green-400">{line}</span>;
    } else if (line.startsWith('user@sp1sh')) {
      return (
        <>
          <span className="text-terminal-green">user@sp1sh:~$</span>
          <span className="text-terminal-text">{line.substring(12)}</span>
        </>
      );
    } else if (line.includes('shell script')) {
      return <span className="text-yellow-400">{line}</span>;
    } else if (line.startsWith('#!/bin/bash')) {
      return <span className="text-purple-400">{line}</span>;
    } else if (line.startsWith('#')) {
      return <span className="text-gray-400">{line}</span>;
    }
    return <span>{line}</span>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="terminal-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex gap-1.5 mr-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Download Script
                  </h3>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-4 hidden sm:block">
                    {script.os === 'linux' ? 'bash' : script.os === 'windows' ? 'powershell' : 'shell'}@sp1sh
                  </span>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {script.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    You're downloading this script for {script.os === 'cross-platform' ? 'Cross-Platform' : script.os} systems.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">Size: 4.2KB</span>
                    <span className="mr-2">•</span>
                    <span>Version: {script.updatedAt ? new Date(script.updatedAt).toLocaleDateString() : 'Latest'}</span>
                  </div>
                </div>
                
                {/* Terminal Animation or Enhanced Terminal Preview */}
                {showAnimation ? (
                  <TerminalAnimation script={script} onComplete={handleAnimationComplete} />
                ) : (
                  <div 
                    className="bg-terminal-bg text-terminal-text rounded-lg h-64 mb-6 border border-gray-700 overflow-hidden flex flex-col"
                  >
                    {/* Terminal statusbar */}
                    <div className="bg-gray-800 px-3 py-1 border-b border-gray-700 flex items-center justify-between">
                      <div className="text-xs text-gray-400">Terminal</div>
                      <div className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</div>
                    </div>
                    
                    {/* Terminal content */}
                    <div className="p-3 flex-1 font-mono text-sm overflow-auto">
                      {typedLines.map((line, index) => (
                        <div key={index} className="terminal-line">
                          {colorizeOutput(line)}
                        </div>
                      ))}
                      {/* Blinking cursor */}
                      <motion.span 
                        className="inline-block w-2 h-4 bg-terminal-text ml-1"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  {!showAnimation && (
                    <AnimatePresence>
                      {typingComplete && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20,
                            delay: 0.5
                          }}
                          onClick={handleStartAnimation}
                          className="flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                          </svg>
                          Download {script.title.toLowerCase().replace(/\s+/g, '-')}.{script.os === 'windows' ? 'ps1' : 'sh'}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    By downloading, you agree to our <a href="/terms" className="text-primary hover:underline">terms of service</a> and <a href="/security" className="text-primary hover:underline">security guidelines</a>.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;