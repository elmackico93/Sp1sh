import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * A non-intrusive button that appears at the bottom right of script displays
 * when a terminal session is connected, allowing users to run scripts directly
 * in their connected terminal.
 */
const RunInTerminalButton = ({ 
  scriptCode, 
  scriptTitle,
  terminalConnected = false,
  position = 'bottom-right'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  // Execute the script in the connected terminal
  const runInTerminal = () => {
    if (!terminalConnected || !scriptCode) return;
    
    // Here you would integrate with your terminal connection service
    // For now, we'll just show an animation to indicate it's working
    setIsAnimating(true);
    
    // Simulate sending to terminal
    console.log(`Sending script "${scriptTitle}" to connected terminal`);
    
    // Reset animation after 1.5 seconds
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
    
    // In a real implementation, you would:
    // terminalService.executeScript(scriptCode);
  };
  
  // Don't render anything if no terminal is connected
  if (!terminalConnected) return null;
  
  return (
    <motion.button
      className={`absolute ${positionClasses[position]} group z-10`}
      initial={{ opacity: 0.6, scale: 0.95 }}
      animate={{ 
        opacity: isHovered ? 1 : 0.8, 
        scale: isHovered ? 1 : 0.95,
        rotate: isAnimating ? [0, 15, -15, 0] : 0
      }}
      transition={{ 
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        rotate: { 
          duration: 0.5, 
          repeat: isAnimating ? 1 : 0,
          repeatType: 'reverse'
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={runInTerminal}
      title="Run in your connected terminal"
      aria-label="Run script in terminal"
    >
      <div className="flex items-center justify-center bg-gray-800 dark:bg-gray-700 rounded-full p-2 shadow-lg transform transition-all duration-200 group-hover:shadow-terminal-glow dark:group-hover:shadow-terminal-glow-dark">
        <div className="relative">
          {/* Terminal icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-200 dark:text-gray-200" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          
          {/* Small play indicator */}
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-2 w-2 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip that appears on hover */}
      <motion.div
        className="absolute right-full mr-2 whitespace-nowrap bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        Run in your terminal
      </motion.div>
    </motion.button>
  );
};

export default RunInTerminalButton;