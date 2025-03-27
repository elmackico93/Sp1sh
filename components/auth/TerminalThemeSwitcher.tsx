import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminalTheme, TerminalTheme } from './TerminalThemeProvider';
import { useTheme } from 'next-themes';

interface ThemeOption {
  id: TerminalTheme;
  name: string;
  icon: string;
}

export const TerminalThemeSwitcher: React.FC = () => {
  const { terminalTheme, setTerminalTheme, toggleThemeVariant } = useTerminalTheme();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && 
          e.target instanceof HTMLElement && 
          !e.target.closest('.theme-switcher-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Theme options
  const themeOptions: ThemeOption[] = [
    { id: 'tokyo-night', name: 'Tokyo Night', icon: '🗼' },
    { id: 'nord', name: 'Nord', icon: '❄️' },
    { id: 'dracula', name: 'Dracula', icon: '🧛' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'monokai', name: 'Monokai', icon: '🎨' }
  ];
  
  return (
    <div className="theme-switcher-container absolute top-4 right-4 z-20">
      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-toggle-btn"
        aria-label="Toggle terminal theme"
        title="Terminal theme options"
      >
        <span role="img" aria-label="Theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
      </button>
      
      {/* Theme options dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-terminal-bg border border-terminal-border rounded-md shadow-lg z-30 overflow-hidden"
          >
            <div className="py-1">
              {/* Dark/Light mode toggle */}
              <button
                onClick={() => {
                  toggleThemeVariant();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-terminal-header-bg flex items-center justify-between"
                style={{ color: 'var(--terminal-text)' }}
              >
                <span>Theme Mode</span>
                <span>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
              </button>
              
              <div className="border-t border-terminal-border my-1"></div>
              
              {/* Terminal theme options */}
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setTerminalTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-terminal-header-bg flex items-center ${
                    terminalTheme === option.id ? 'bg-terminal-highlight' : ''
                  }`}
                  style={{ color: 'var(--terminal-text)' }}
                >
                  <span className="mr-2">{option.icon}</span>
                  <span>{option.name}</span>
                  {terminalTheme === option.id && (
                    <span className="ml-auto">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TerminalThemeSwitcher;
