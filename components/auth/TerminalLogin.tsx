import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInput from './CommandInput';

interface TerminalLoginProps {
  isLoading: boolean;
  onLoginSuccess: () => void;
  onLoginError?: (error: string) => void;
}

type AuthStage = 'init' | 'username' | 'password' | 'authenticating' | 'success' | 'failure';

const TerminalLogin: React.FC<TerminalLoginProps> = ({ 
  isLoading,
  onLoginSuccess,
  onLoginError
}) => {
  const [stage, setStage] = useState<AuthStage>('init');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Initial welcome messages
  const welcomeLines = [
    "Sp1sh Secure Access Terminal",
    "-------------------------------",
    "Welcome to the Sp1sh script repository.",
    "Authentication required to proceed.",
    "",
    "Type 'help' for assistance or begin authentication.",
    "",
  ];
  
  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Initial typing effect
  useEffect(() => {
    if (isTyping && currentTypingLine < welcomeLines.length) {
      const timer = setTimeout(() => {
        setTerminalOutput(prev => [...prev, welcomeLines[currentTypingLine]]);
        setCurrentTypingLine(prev => prev + 1);
      }, currentTypingLine === 0 ? 300 : 100);

      return () => clearTimeout(timer);
    } else if (currentTypingLine >= welcomeLines.length) {
      setIsTyping(false);
      setStage('username');
    }
  }, [isTyping, currentTypingLine]);

  // Handle command input
  const handleCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `> ${command}`]);
    
    // Process commands based on current stage
    if (stage === 'username') {
      if (command.toLowerCase() === 'help') {
        setTerminalOutput(prev => [
          ...prev, 
          "Available commands:",
          "  login - Begin authentication",
          "  clear - Clear terminal",
          "  help  - Show this help message",
          ""
        ]);
      } else if (command.toLowerCase() === 'clear') {
        setTerminalOutput([]);
      } else if (command.toLowerCase() === 'login' || command.toLowerCase().startsWith('user ')) {
        const extractedUsername = command.toLowerCase().startsWith('user ') 
          ? command.substring(5).trim() 
          : '';
        
        if (extractedUsername) {
          setUsername(extractedUsername);
          setTerminalOutput(prev => [
            ...prev, 
            `Username set: ${extractedUsername}`,
            "Please enter your password:"
          ]);
          setStage('password');
        } else {
          setTerminalOutput(prev => [
            ...prev, 
            "Please enter your username or email:"
          ]);
          setStage('username');
        }
      } else {
        // Treat input as username
        if (command.trim()) {
          setUsername(command);
          setTerminalOutput(prev => [
            ...prev, 
            "Please enter your password:"
          ]);
          setStage('password');
        } else {
          setTerminalOutput(prev => [
            ...prev, 
            "Error: Username cannot be empty.",
            "Please enter your username or email:"
          ]);
        }
      }
    } else if (stage === 'password') {
      if (command.toLowerCase() === 'help') {
        setTerminalOutput(prev => [
          ...prev, 
          "Enter your password to continue.",
          "Or type 'back' to return to username entry.",
          ""
        ]);
      } else if (command.toLowerCase() === 'clear') {
        setTerminalOutput([]);
      } else if (command.toLowerCase() === 'back') {
        setUsername('');
        setTerminalOutput(prev => [
          ...prev, 
          "Returning to username entry.",
          "Please enter your username or email:"
        ]);
        setStage('username');
      } else {
        // Treat input as password
        if (command.trim()) {
          setPassword(command);
          setTerminalOutput(prev => [
            ...prev, 
            "Authenticating...",
            ""
          ]);
          setStage('authenticating');
          
          // Simulate authentication process
          setTimeout(() => {
            // Mock validation (in a real app, this would be an API call)
            if (username === 'admin' && command === 'password') {
              setTerminalOutput(prev => [
                ...prev, 
                "Authentication successful!",
                "Welcome back, " + username + "!",
                "Redirecting to dashboard...",
                ""
              ]);
              setStage('success');
              onLoginSuccess();
            } else {
              setTerminalOutput(prev => [
                ...prev, 
                "Authentication failed: Invalid credentials.",
                "Please try again.",
                "Enter username:"
              ]);
              setStage('username');
              setUsername('');
              setPassword('');
              setError('Invalid username or password');
              if (onLoginError) {
                onLoginError('Invalid username or password');
              }
            }
          }, 1500);
        } else {
          setTerminalOutput(prev => [
            ...prev, 
            "Error: Password cannot be empty.",
            "Please enter your password:"
          ]);
        }
      }
    }
  };

  return (
    <div className="terminal-window bg-terminal-bg border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      {/* Terminal Header */}
      <div className="terminal-header flex items-center justify-between p-2 bg-gray-800">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400">secure_login.sh</div>
        <div className="ml-auto mr-2 flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          <span>ENCRYPTED</span>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="terminal-body h-[60vh] min-h-[400px] p-4 md:p-6 font-mono text-sm text-terminal-text overflow-y-auto"
      >
        {/* Terminal Output */}
        {terminalOutput.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 my-1">{error}</div>
        )}
        
        {/* Input Command Line */}
        <AnimatePresence mode="wait">
          {!isTyping && stage !== 'authenticating' && stage !== 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1"
            >
              <CommandInput 
                prompt={stage === 'username' ? '>' : 'password >'} 
                type={stage === 'password' ? 'password' : 'text'}
                onSubmit={handleCommand}
                placeholder={stage === 'username' ? 'Enter username or email' : 'Enter password'}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Authenticating Animation */}
        {stage === 'authenticating' && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse mr-2">▋</div>
            <span>Verifying credentials...</span>
          </div>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="terminal-footer py-2 px-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {stage === 'password' ? 'Secure mode: enabled' : 'Type "help" for assistance'}
        </div>
        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
          Reset Access
        </Link>
      </div>
    </div>
  );
};

export default TerminalLogin;