import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import CommandInput from './CommandInput';

interface TerminalLoginProps {
  isLoading: boolean;
  onLoginSuccess: () => void;
  onLoginError?: (error: string) => void;
}

type AuthStage = 'init' | 'username' | 'password' | 'authenticating' | 'success';

const getPlaceholderForStage = (stage: AuthStage, error?: string): string => {
  if (error) {
    switch (stage) {
      case 'username': return 'Please enter a valid username or email';
      case 'password': return 'Password must not be empty';
    }
  }
  return stage === 'username' ? 'Enter username or email' : 'Enter password';
};

const TerminalLogin: React.FC<TerminalLoginProps> = ({
  isLoading,
  onLoginSuccess,
  onLoginError
}) => {
  const [stage, setStage] = useState<AuthStage>('init');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeLines = [
    'Sp1sh Secure Access Terminal',
    '-------------------------------',
    'Welcome to the Sp1sh script repository.',
    'Authentication required to proceed.',
    '',
    "Type 'help' for assistance or begin authentication.",
    ''
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [terminalOutput]);

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

  const handleCommand = (command: string) => {
    setAuthError('');
    setTerminalOutput(prev => [...prev, `> ${command}`]);
    const lower = command.toLowerCase();

    if (lower === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        'Available commands:',
        '  login - Begin authentication',
        '  clear - Clear terminal',
        '  help  - Show this help message',
        ''
      ]);
      return;
    }

    if (lower === 'clear') {
      setTerminalOutput([]);
      return;
    }

    switch (stage) {
      case 'username':
        if (!command.trim()) {
          setAuthError('Username or email required');
          return;
        }
        setUsername(command);
        setTerminalOutput(prev => [...prev, 'Please enter your password:']);
        setStage('password');
        break;

      case 'password':
        if (!command.trim()) {
          setAuthError('Password cannot be empty');
          return;
        }
        setTerminalOutput(prev => [...prev, 'Authenticating...']);
        setStage('authenticating');
        setTimeout(() => {
          if (username === 'admin' && command === 'password') {
            setTerminalOutput(prev => [
              ...prev,
              'Authentication successful!',
              `Welcome back, ${username}!`,
              'Redirecting to dashboard...',
              ''
            ]);
            setStage('success');
            onLoginSuccess();
          } else {
            setAuthError('Invalid username or password');
            setStage('username');
            setUsername('');
          }
        }, 1500);
        break;
    }
  };

  return (
    <div className="terminal-window bg-terminal-bg border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
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

      <div
        ref={terminalRef}
        className="terminal-body h-[60vh] min-h-[400px] p-4 pb-28 md:p-6 font-mono text-sm text-terminal-text overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalOutput.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}

        {authError && (
          <div className="mt-2 text-red-500 text-sm font-mono">{authError}</div>
        )}

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
                placeholder={getPlaceholderForStage(stage, authError || undefined)}
                inputRef={inputRef}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'authenticating' && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse mr-2">▋</div>
            <span>Verifying credentials...</span>
          </div>
        )}
      </div>

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