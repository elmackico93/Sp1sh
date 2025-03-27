import React from 'react';
import { useTerminalTheme } from './TerminalThemeProvider';

// This component has been modified to not render a visible button
export const TerminalThemeSwitcher: React.FC = () => {
  // Keep the context connection to maintain state management
  const { terminalTheme } = useTerminalTheme();
  
  // Return null to render nothing
  return null;
};

export default TerminalThemeSwitcher;
