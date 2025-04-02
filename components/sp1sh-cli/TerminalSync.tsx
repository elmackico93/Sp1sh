import React, { useState, useEffect } from 'react';

const TerminalSync = () => {
  // State management
  const [currentStep, setCurrentStep] = useState('discover'); // discover, download, connect, synced
  const [sessionId, setSessionId] = useState('SCRPT-X4F9-H7D2');
  const [timeRemaining, setTimeRemaining] = useState(1795); // 29:55 in seconds
  const [downloadPlatform, setDownloadPlatform] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [allowExecution, setAllowExecution] = useState(true);
  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const [isWaiting, setIsWaiting] = useState(true);
  const [showCommandCopied, setShowCommandCopied] = useState(false);
  const [terminalExpanded, setTerminalExpanded] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining <= 0 || currentStep !== 'connect') return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining, currentStep]);

  // Reset copied state after delay
  useEffect(() => {
    if (!showCommandCopied) return;
    
    const timer = setTimeout(() => {
      setShowCommandCopied(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [showCommandCopied]);

  // Handle session refresh
  const handleRefreshSession = () => {
    // In a real app, this would call an API to refresh the session
    setSessionId(`SCRPT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${
      Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setTimeRemaining(1800); // Reset to 30:00
  };

  // Handle session end
  const handleEndSession = () => {
    setIsWaiting(false);
    setCurrentStep('download'); // Go back to download step
  };
  
  // Handle download for specific platform
  const handleDownload = (platform) => {
    setDownloadPlatform(platform);
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setCurrentStep('connect'); // Move to connection step after download
    }, 1500);
  };

  // Copy connection command to clipboard
  const copyConnectionCommand = () => {
    navigator.clipboard.writeText(`termlink connect ${sessionId}`);
    setShowCommandCopied(true);
  };

  // Simulate connection established
  const simulateConnection = () => {
    setCurrentStep('synced');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      {/* Header with glow effect - "Hacker Philosophy" design */}
      <div className="relative bg-gray-900 p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 opacity-50"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500"></div>
        
        <div className="relative flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-green-500 mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="text-white text-lg font-mono font-bold">TermLink Sync</div>
          </div>
          
          {currentStep === 'connect' && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <div className="text-white font-mono">{formatTime(timeRemaining)}</div>
            </div>
          )}
        </div>
        
        {currentStep === 'discover' && (
          <div className="text-gray-300 text-sm mt-3 font-mono">
            Synchronize your terminal with our platform for seamless script execution and collaborative debugging.
          </div>
        )}
      </div>

      {/* Main content area - changes based on current step */}
      {currentStep === 'discover' && (
        <div className="p-4">
          <div className="mb-4 text-center">
            <h2 className="text-base font-medium mb-2">Terminal Synchronization</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your local terminal to SP1.SH and execute scripts with a single click
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-lg mb-4">
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <span>1</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Download TermLink CLI</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Our lightweight terminal connector for your OS
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <span>2</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Connect Your Terminal</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Run a simple command with your unique session ID
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 flex-shrink-0 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <span>3</span>
              </div>
              <div>
                <h3 className="font-medium text-sm">Execute Scripts Seamlessly</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Run scripts directly from browser to terminal
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setCurrentStep('download')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {currentStep === 'download' && (
        <>
          {/* Download section header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-base font-medium text-center text-gray-800 dark:text-gray-200">Download TermLink CLI</h2>
          </div>

          {/* Download options - Simplified layout */}
          <div className="grid grid-cols-3 gap-3 px-4 py-3">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.5" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </div>
              <div className="font-medium">Windows</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">69.2 MB</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Version 1.2.3</div>
              
              <button 
                onClick={() => handleDownload('windows')}
                className={`mt-2 px-3 py-1 rounded text-sm bg-blue-500 text-white ${
                  downloadPlatform === 'windows' && isDownloading ? 'opacity-75' : ''
                }`}>
                {downloadPlatform === 'windows' && isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.5" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M7.5 16.5l9-9M16.5 16.5l-9-9" />
                </svg>
              </div>
              <div className="font-medium">macOS</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">57.8 MB</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Version 1.2.3</div>
              
              <button 
                onClick={() => handleDownload('macos')}
                className={`mt-2 px-3 py-1 rounded text-sm bg-blue-500 text-white ${
                  downloadPlatform === 'macos' && isDownloading ? 'opacity-75' : ''
                }`}>
                {downloadPlatform === 'macos' && isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.5" fill="none">
                  <path d="M12 1.5L3 8v8l9 6.5 9-6.5V8l-9-6.5z" />
                </svg>
              </div>
              <div className="font-medium">Linux</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">64.5 MB</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">Version 1.2.3</div>
              
              <button 
                onClick={() => handleDownload('linux')}
                className={`mt-2 px-3 py-1 rounded text-sm bg-blue-500 text-white ${
                  downloadPlatform === 'linux' && isDownloading ? 'opacity-75' : ''
                }`}>
                {downloadPlatform === 'linux' && isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
          
          {/* SHA-256 checksum */}
          <div className="px-4 pb-3 text-center">
            <div className="inline-flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              SHA-256 checksum
            </div>
          </div>
          
          {/* Installation reminder */}
          <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              After installation, we'll guide you through connecting your terminal
            </p>
          </div>
        </>
      )}

      {currentStep === 'connect' && (
        <>
          {/* Session ID display */}
          <div className="bg-gray-900 p-3 border-b border-gray-700 flex justify-between items-center">
            <div className="text-gray-300 text-sm font-mono">Session ID:</div>
            <div className="text-white font-mono font-bold text-lg tracking-wider">
              {sessionId}
            </div>
          </div>

          {/* Connection instructions */}
          <div className="p-4">
            <h2 className="text-base font-medium mb-3">Connect Your Terminal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Run the following command in your terminal to establish a secure connection:
            </p>
            
            <div className="relative">
              <div className="bg-gray-900 text-green-400 font-mono text-sm p-3 rounded-md mb-3 flex items-center">
                <span className="mr-2">$</span>
                <span>termlink connect {sessionId}</span>
              </div>
              
              <button 
                onClick={copyConnectionCommand}
                className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4M14 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4"></path>
                </svg>
              </button>
              
              {showCommandCopied && (
                <div className="absolute -top-8 right-0 bg-black text-white text-xs py-1 px-2 rounded shadow-lg">
                  Copied to clipboard!
                </div>
              )}
            </div>
            
            <div className="flex justify-center mb-3">
              <button
                onClick={simulateConnection}
                className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
              >
                Simulate Connection
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Waiting for connection... {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Connection status and controls */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-750">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleRefreshSession}
                className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-center text-sm"
              >
                Refresh Session ID
              </button>
              
              <div className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                <div className="text-sm">Allow Execution</div>
                <div 
                  onClick={() => setAllowExecution(!allowExecution)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                    allowExecution ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${
                    allowExecution ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
              
              <button 
                onClick={handleEndSession}
                className="py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-center text-sm"
              >
                End Session
              </button>
              
              <div className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                <div className="text-sm">Read-Only Mode</div>
                <div 
                  onClick={() => setReadOnlyMode(!readOnlyMode)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer ${
                    readOnlyMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${
                    readOnlyMode ? 'translate-x-4' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {currentStep === 'synced' && (
        <>
          {/* Connected status */}
          <div className="bg-green-500 text-white p-3 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="font-medium">Terminal Connected</span>
          </div>
          
          {/* Simulated terminal preview */}
          <div className="p-3">
            <div className="bg-gray-900 rounded-md overflow-hidden">
              <div className="bg-gray-800 p-2 border-b border-gray-700 flex items-center justify-between">
                <div className="flex">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-xs">sp1sh-terminal</div>
                <button 
                  onClick={() => setTerminalExpanded(!terminalExpanded)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {terminalExpanded ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    )}
                  </svg>
                </button>
              </div>
              
              <div className={`text-green-400 font-mono text-sm p-2 ${terminalExpanded ? 'h-64' : 'h-28'} overflow-y-auto`}>
                <div>user@sp1sh:~$ termlink connect {sessionId}</div>
                <div className="text-gray-400">Establishing secure connection to SP1.SH...</div>
                <div className="text-gray-400">Authenticating session ID: {sessionId}</div>
                <div className="text-green-500">Connection established successfully!</div>
                <div className="text-gray-400">Terminal synchronization active. Ready to receive commands.</div>
                <div>user@sp1sh:~$ _</div>
                {terminalExpanded && (
                  <>
                    <div className="mt-2">user@sp1sh:~$ cat welcome.txt</div>
                    <div className="text-blue-400">
                      Welcome to SP1.SH Terminal Sync! Your terminal is now connected
                      to our platform. You can now:
                    </div>
                    <div className="text-blue-400 ml-2">- Execute scripts directly from the web interface</div>
                    <div className="text-blue-400 ml-2">- Collaborate with team members in real-time</div>
                    <div className="text-blue-400 ml-2">- Access your command history across devices</div>
                    <div className="text-blue-400 ml-2">- Get support from our experts when needed</div>
                    <div className="mt-2">user@sp1sh:~$ _</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons for connected state */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between">
            <button 
              onClick={handleEndSession}
              className="py-2 px-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded text-sm"
            >
              Disconnect
            </button>
            
            <button 
              className="py-2 px-3 bg-blue-500 text-white rounded text-sm"
            >
              Execute Script
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TerminalSync;