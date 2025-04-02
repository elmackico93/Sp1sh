import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Terminal Context
export const TerminalContext = createContext({
  isTerminalConnected: false,
  sessionId: null,
  connectTerminal: () => {},
  disconnectTerminal: () => {},
  executeInTerminal: () => {},
});

// Create the Terminal Provider component
export const TerminalProvider = ({ children }) => {
  const [isTerminalConnected, setIsTerminalConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  // Generate a session ID
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  // Connect to terminal
  const connectTerminal = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setIsTerminalConnected(true);
    console.log(`Terminal connected with session ID: ${newSessionId}`);
    return newSessionId;
  };
  
  // Disconnect from terminal
  const disconnectTerminal = () => {
    setIsTerminalConnected(false);
    setSessionId(null);
    console.log('Terminal disconnected');
  };
  
  // Execute script in terminal
  const executeInTerminal = (scriptCode, scriptTitle) => {
    if (!isTerminalConnected) {
      console.error('Cannot execute script: Terminal not connected');
      return false;
    }
    
    console.log(`Executing script "${scriptTitle}" in terminal`);
    console.log(`Session ID: ${sessionId}`);
    console.log('Script code:', scriptCode);
    
    // In a real implementation, this would send the script to the terminal
    // through a websocket or another communication channel
    
    return true;
  };
  
  // Monitor for terminal connection events
  useEffect(() => {
    // Listen for terminal sync events from TerminalSync component
    // This is a placeholder - in a real implementation, you would 
    // subscribe to events from your terminal service
    
    const checkTerminalStatus = () => {
      // In a real implementation, this would check the status 
      // of the terminal connection
      
      // For demo purposes, we'll use localStorage to sync between components
      const storedSessionId = localStorage.getItem('terminalSessionId');
      if (storedSessionId && !isTerminalConnected) {
        setSessionId(storedSessionId);
        setIsTerminalConnected(true);
      } else if (!storedSessionId && isTerminalConnected) {
        setIsTerminalConnected(false);
        setSessionId(null);
      }
    };
    
    // Check status periodically
    const interval = setInterval(checkTerminalStatus, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isTerminalConnected]);
  
  // Export the context values
  const contextValue = {
    isTerminalConnected,
    sessionId,
    connectTerminal,
    disconnectTerminal,
    executeInTerminal,
  };
  
  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  );
};

// Custom hook for easier use of the Terminal Context
export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};