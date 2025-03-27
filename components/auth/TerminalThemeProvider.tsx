import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';

// Theme options type
export type TerminalTheme = 'tokyo-night' | 'nord' | 'dracula' | 'github' | 'monokai';

// Context type
interface TerminalThemeContextType {
  terminalTheme: TerminalTheme;
  setTerminalTheme: (theme: TerminalTheme) => void;
  toggleThemeVariant: () => void;
  isTransitioning: boolean;
}

// Create context with default values
const TerminalThemeContext = createContext<TerminalThemeContextType>({
  terminalTheme: 'tokyo-night',
  setTerminalTheme: () => {},
  toggleThemeVariant: () => {},
  isTransitioning: false
});

// Hook for using the terminal theme context
export const useTerminalTheme = () => useContext(TerminalThemeContext);

interface TerminalThemeProviderProps {
  children: ReactNode;
  defaultTheme?: TerminalTheme;
}

export const TerminalThemeProvider: React.FC<TerminalThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'tokyo-night' 
}) => {
  const { theme, setTheme } = useTheme();
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>(defaultTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load saved terminal theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('sp1sh-terminal-theme');
    if (savedTheme && isValidTheme(savedTheme)) {
      setTerminalTheme(savedTheme as TerminalTheme);
    }
  }, []);

  // Save terminal theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sp1sh-terminal-theme', terminalTheme);

    // Apply theme-specific CSS custom properties
    document.documentElement.setAttribute('data-terminal-theme', terminalTheme);
    
    // Apply specific theme color variables based on the selected terminal theme
    applyThemeColors(terminalTheme, theme === 'dark');
  }, [terminalTheme, theme]);

  // Toggle between light and dark mode
  const toggleThemeVariant = () => {
    setIsTransitioning(true);
    
    // Add transition class to enable smooth transitions
    document.documentElement.classList.add('theme-transition');
    
    // Toggle theme
    setTheme(theme === 'dark' ? 'light' : 'dark');
    
    // Set a timeout to remove the transition class and update isTransitioning
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
      setIsTransitioning(false);
    }, 500); // Match the transition duration in CSS
  };

  // Check if a theme name is valid
  const isValidTheme = (themeName: string): boolean => {
    return ['tokyo-night', 'nord', 'dracula', 'github', 'monokai'].includes(themeName);
  };

  // Apply theme-specific colors
  const applyThemeColors = (theme: TerminalTheme, isDark: boolean) => {
    const root = document.documentElement;
    
    // Default colors (will be overridden as needed)
    let colors = {
      bg: isDark ? '#1a1b26' : '#f7f9fc',
      headerBg: isDark ? '#24283b' : '#e4e9f2',
      text: isDark ? '#a9b1d6' : '#2e3440',
      green: isDark ? '#9ece6a' : '#0f766e',
      border: isDark ? '#414868' : '#d8dee9',
      success: isDark ? '#9ece6a' : '#10b981',
      error: isDark ? '#f7768e' : '#ef4444',
      warning: isDark ? '#e0af68' : '#f59e0b',
      info: isDark ? '#7aa2f7' : '#3b82f6',
      greenRgb: isDark ? '158, 206, 106' : '15, 118, 110',
      infoRgb: isDark ? '122, 162, 247' : '59, 130, 246'
    };
    
    // Apply theme-specific overrides
    switch (theme) {
      case 'nord':
        colors = {
          ...colors,
          bg: isDark ? '#2e3440' : '#eceff4',
          headerBg: isDark ? '#3b4252' : '#e5e9f0',
          text: isDark ? '#d8dee9' : '#2e3440',
          green: isDark ? '#a3be8c' : '#4c566a',
          border: isDark ? '#4c566a' : '#d8dee9',
          success: isDark ? '#a3be8c' : '#a3be8c',
          error: isDark ? '#bf616a' : '#bf616a',
          warning: isDark ? '#ebcb8b' : '#ebcb8b',
          info: isDark ? '#81a1c1' : '#5e81ac',
          greenRgb: isDark ? '163, 190, 140' : '76, 86, 106',
          infoRgb: isDark ? '129, 161, 193' : '94, 129, 172'
        };
        break;
      case 'dracula':
        colors = {
          ...colors,
          bg: isDark ? '#282a36' : '#f8f8f2',
          headerBg: isDark ? '#44475a' : '#eeeeee',
          text: isDark ? '#f8f8f2' : '#282a36',
          green: isDark ? '#50fa7b' : '#50fa7b',
          border: isDark ? '#44475a' : '#dddddd',
          success: isDark ? '#50fa7b' : '#50fa7b',
          error: isDark ? '#ff5555' : '#ff5555',
          warning: isDark ? '#ffb86c' : '#ffb86c',
          info: isDark ? '#8be9fd' : '#8be9fd',
          greenRgb: isDark ? '80, 250, 123' : '80, 250, 123',
          infoRgb: isDark ? '139, 233, 253' : '139, 233, 253'
        };
        break;
      case 'github':
        colors = {
          ...colors,
          bg: isDark ? '#0d1117' : '#ffffff',
          headerBg: isDark ? '#161b22' : '#f6f8fa',
          text: isDark ? '#c9d1d9' : '#24292e',
          green: isDark ? '#3fb950' : '#28a745',
          border: isDark ? '#30363d' : '#e1e4e8',
          success: isDark ? '#3fb950' : '#28a745',
          error: isDark ? '#f85149' : '#d73a49',
          warning: isDark ? '#d29922' : '#f66a0a',
          info: isDark ? '#58a6ff' : '#0366d6',
          greenRgb: isDark ? '63, 185, 80' : '40, 167, 69',
          infoRgb: isDark ? '88, 166, 255' : '3, 102, 214'
        };
        break;
      case 'monokai':
        colors = {
          ...colors,
          bg: isDark ? '#272822' : '#fafafa',
          headerBg: isDark ? '#3e3d32' : '#f0f0f0',
          text: isDark ? '#f8f8f2' : '#272822',
          green: isDark ? '#a6e22e' : '#66d9ef',
          border: isDark ? '#49483e' : '#e8e8e8',
          success: isDark ? '#a6e22e' : '#a6e22e',
          error: isDark ? '#f92672' : '#f92672',
          warning: isDark ? '#fd971f' : '#fd971f',
          info: isDark ? '#66d9ef' : '#66d9ef',
          greenRgb: isDark ? '166, 226, 46' : '102, 217, 239',
          infoRgb: isDark ? '102, 217, 239' : '102, 217, 239'
        };
        break;
      case 'tokyo-night':
      default:
        // Default values already set
        break;
    }
    
    // Apply colors to CSS variables
    root.style.setProperty('--terminal-bg', colors.bg);
    root.style.setProperty('--terminal-header-bg', colors.headerBg);
    root.style.setProperty('--terminal-footer-bg', colors.headerBg);
    root.style.setProperty('--terminal-text', colors.text);
    root.style.setProperty('--terminal-green', colors.green);
    root.style.setProperty('--terminal-border', colors.border);
    root.style.setProperty('--terminal-success', colors.success);
    root.style.setProperty('--terminal-error', colors.error);
    root.style.setProperty('--terminal-warning', colors.warning);
    root.style.setProperty('--terminal-info', colors.info);
    root.style.setProperty('--terminal-green-rgb', colors.greenRgb);
    root.style.setProperty('--terminal-info-rgb', colors.infoRgb);
  };

  return (
    <TerminalThemeContext.Provider 
      value={{ 
        terminalTheme, 
        setTerminalTheme, 
        toggleThemeVariant,
        isTransitioning
      }}
    >
      {children}
    </TerminalThemeContext.Provider>
  );
};

export default TerminalThemeProvider;
