
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CommandInput from './CommandInput';

interface TerminalSignupProps {
  isLoading: boolean;
  onSignupSuccess: () => void;
  onSignupError?: (error: string) => void;
}

type SignupStage = 
  | 'init' 
  | 'username' 
  | 'email'
  | 'password'
  | 'confirm-password'
  | 'terms'
  | 'processing'
  | 'success' 
  | 'failure';

type MessageType = 'default' | 'system' | 'success' | 'error' | 'info' | 'command';

interface TerminalMessage {
  text: string;
  type?: MessageType;
  animate?: boolean;
}

const getPlaceholderForStage = (stage: SignupStage, error?: string): string => {
  if (error) {
    switch (stage) {
      case 'confirm-password': return 'Passwords must match';
      case 'password': return 'Try a stronger password';
    }
  }
  switch (stage) {
    case 'username': return 'e.g. john_dev42';
    case 'email': return 'e.g. dev@sp1sh.com';
    case 'password': return 'Min 8 chars, one uppercase, one number';
    case 'confirm-password': return 'Repeat password exactly';
    case 'terms': return 'Type "accept" to agree';
    default: return '';
  }
};

const TerminalSignup: React.FC<TerminalSignupProps> = ({ 
  isLoading,
  onSignupSuccess,
  onSignupError
}) => {
  const [stage, setStage] = useState<SignupStage>('init');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<TerminalMessage[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const [progressIndicator, setProgressIndicator] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeLines: TerminalMessage[] = [
    { text: "Welcome to Sp1sh — Choose a unique username to start:", type: 'system', animate: true }
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    switch (stage) {
      case 'init':
      case 'username': setProgressIndicator(0); break;
      case 'email': setProgressIndicator(25); break;
      case 'password': setProgressIndicator(50); break;
      case 'confirm-password': setProgressIndicator(75); break;
      case 'terms':
      case 'processing':
      case 'success': setProgressIndicator(100); break;
    }
  }, [stage]);

  useEffect(() => {
    if (isTyping && currentTypingLine < welcomeLines.length) {
      const timer = setTimeout(() => {
        setTerminalOutput(prev => [...prev, welcomeLines[currentTypingLine]]);
        setCurrentTypingLine(prev => prev + 1);
      }, currentTypingLine === 0 ? 300 : 150);
      return () => clearTimeout(timer);
    } else if (currentTypingLine >= welcomeLines.length) {
      setIsTyping(false);
      setStage('username');
    }
  }, [isTyping, currentTypingLine]);

  const handleCommand = (command: string) => {
    setError('');
    setTerminalOutput(prev => [...prev, { text: `> ${command}`, type: 'command' }]);
    const lower = command.toLowerCase();

    if (lower === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        { text: 'Available commands: clear, cancel, help', type: 'info' }
      ]);
      return;
    }

    if (lower === 'clear') {
      setTerminalOutput([]);
      return;
    }

    if (lower === 'cancel') {
      setTerminalOutput(prev => [
        ...prev,
        { text: 'Registration cancelled.', type: 'error' }
      ]);
      resetForm();
      setStage('username');
      return;
    }

    switch (stage) {
      case 'username':
        if (!command.trim()) {
          setError('Username cannot be empty');
          setTerminalOutput(prev => [...prev, { text: 'Username cannot be empty.', type: 'error' }]);
          return;
        }
        setUsername(command);
        setTerminalOutput(prev => [...prev, { text: 'Enter your email:' }]);
        setStage('email');
        break;

      case 'email':
        if (!command.includes('@') || !command.includes('.')) {
          setError('Invalid email. Please enter an address like dev@sp1sh.com');
          
          return;
        }
        setEmail(command);
        setTerminalOutput(prev => [...prev, { text: 'Create a password:' }]);
        setStage('password');
        break;

      case 'password':
        if (command.length < 6) {
          setError('Weak password. Use at least 8 chars, 1 number, 1 uppercase.');
          
          return;
        }
        setPassword(command);
        setTerminalOutput(prev => [...prev, { text: 'Confirm your password:' }]);
        setStage('confirm-password');
        break;

      case 'confirm-password':
        if (command !== password) {
          setError('Passwords must match. Please re-type the same password.');
          
          return;
        }
        setConfirmPassword(command);
        setTerminalOutput(prev => [...prev, { text: 'Type "accept" to continue or "cancel" to abort.' }]);
        setStage('terms');
        break;

      case 'terms':
        if (lower === 'accept') {
          setTerminalOutput(prev => [...prev, { text: 'Registering...', type: 'system' }]);
          setStage('processing');
          setTimeout(() => {
            setTerminalOutput(prev => [
              ...prev,
              { text: `Welcome ${username}! Registration complete.`, type: 'success' }
            ]);
            setStage('success');
            onSignupSuccess();
          }, 1200);
        } else {
          setTerminalOutput(prev => [...prev, { text: 'Please type "accept" or "cancel".', type: 'info' }]);
        }
        break;

      default:
        setTerminalOutput(prev => [...prev, { text: 'Invalid action.', type: 'error' }]);
        break;
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="terminal-window bg-terminal-bg border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      <div className="terminal-header flex items-center justify-between p-2 bg-gray-800">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400">secure_signup.sh</div>
        <div className="ml-auto mr-2 flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          <span>ENCRYPTED</span>
        </div>
      </div>

      <div className="bg-gray-700 h-0.5">
        <div className="bg-green-500 h-0.5 transition-all duration-500 ease-out" style={{ width: `${progressIndicator}%` }}></div>
      </div>

      <div
        ref={terminalRef}
        className="terminal-body h-[50vh] min-h-[320px] p-4 md:p-6 font-mono text-sm text-terminal-text overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalOutput.map((message, index) => (
          <div key={index} className={`terminal-line ${message.type ? `text-${message.type}` : ''}`}>
            {message.text}
          </div>
        ))}

        
        {error && (
          <div className="mt-2 text-red-500 text-sm font-mono">{error}</div>
        )}


        <AnimatePresence mode="wait">
          {!isTyping && stage !== 'processing' && stage !== 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1"
            >
              <CommandInput 
                prompt=">"
                placeholder={getPlaceholderForStage(stage, error)}
                key={stage + (error || "")}
                type="text"
                onSubmit={handleCommand}
                disabled={isLoading}
                inputRef={inputRef}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'processing' && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse mr-2">▋</div>
            <span>Processing registration...</span>
          </div>
        )}
      </div>

      <div className="terminal-footer py-2 px-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {stage === 'password' || stage === 'confirm-password' ? 'Secure mode: enabled' : 'Type "help" for assistance'}
        </div>
        <Link href="/signin" className="text-xs text-primary hover:underline">
          Already have an account?
        </Link>
      </div>
    </div>
  );
};

export default TerminalSignup;