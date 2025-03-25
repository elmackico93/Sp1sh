import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsProps {
  show?: boolean;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ show = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the shortcut helper after a delay
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  // Hide the helper after 15 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const shortcuts = [
    { key: 'Tab', description: 'Autocomplete commands' },
    { key: '↑/↓', description: 'Browse command history' },
    { key: 'Esc', description: 'Clear input' },
    { key: 'Ctrl+L', description: 'Clear terminal' },
  ];

  const keyStyle = "inline-block px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded border border-gray-700 font-mono";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl text-center z-20 backdrop-blur-sm"
        >
          <div className="text-xs text-gray-500 mb-2">Keyboard Shortcuts</div>
          <div className="flex flex-wrap gap-3 justify-center">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={keyStyle}>{shortcut.key}</span>
                <span className="text-xs text-gray-400">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;