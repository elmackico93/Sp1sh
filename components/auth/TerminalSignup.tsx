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

// Form validation utility functions
const isValidUsername = (username: string): boolean => 
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

const isValidEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password: string): boolean => 
  password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

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
  
  // Initial welcome messages - balanced approach
  const welcomeLines: TerminalMessage[] = [
    { text: "Sp1sh Secure Access Terminal", type: 'system', animate: true },
    { text: "-------------------------------" },
    { text: "Welcome to secure registration.", type: 'info' },
    { text: "Please enter your desired username:", type: 'default', animate: true }
  ];
  
  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Progress indicator for registration process
  useEffect(() => {
    // Update progress based on stage
    switch (stage) {
      case 'init':
      case 'username':
        setProgressIndicator(0);
        break;
      case 'email':
        setProgressIndicator(25);
        break;
      case 'password':
        setProgressIndicator(50);
        break;
      case 'confirm-password':
        setProgressIndicator(75);
        break;
      case 'terms':
      case 'processing':
      case 'success':
        setProgressIndicator(100);
        break;
    }
  }, [stage]);

  // Initial typing effect
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

  // Handle command input
  const handleCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, { text: `> ${command}`, type: 'command' }]);
    
    // Process commands based on current stage
    if (command.toLowerCase() === 'help') {
      showHelpForCurrentStage();
      return;
    }
    
    if (command.toLowerCase() === 'clear') {
      setTerminalOutput([]);
      return;
    }
    
    if (command.toLowerCase() === 'back') {
      handleBackCommand();
      return;
    }
    
    if (command.toLowerCase() === 'cancel') {
      setTerminalOutput(prev => [
        ...prev, 
        { text: "Registration process cancelled.", type: 'system' },
        { text: "Returning to the main prompt." }
      ]);
      resetForm();
      setStage('username');
      return;
    }
    
    if (command.toLowerCase() === 'status') {
      showStatusCommand();
      return;
    }
    
    // Process stage-specific commands
    switch(stage) {
      case 'username':
        handleUsernameInput(command);
        break;
      case 'email':
        handleEmailInput(command);
        break;
      case 'password':
        handlePasswordInput(command);
        break;
      case 'confirm-password':
        handleConfirmPasswordInput(command);
        break;
      case 'terms':
        handleTermsInput(command);
        break;
      default:
        // For other stages, show a generic message
        setTerminalOutput(prev => [
          ...prev,
          { text: "Command not recognized. Type 'help' for assistance.", type: 'error' }
        ]);
    }
  };

  // Show current registration status
  const showStatusCommand = () => {
    setTerminalOutput(prev => [
      ...prev,
      { text: "Registration Status:", type: 'system' },
      { text: `Progress: [${progressIndicator}%]`, type: 'info' },
      { text: username ? `Username: ${username}` : "Username: Not set" },
      { text: email ? `Email: ${email}` : "Email: Not set" },
      { text: password ? "Password: Set" : "Password: Not set" },
      { text: confirmPassword ? "Password confirmation: Complete" : "Password confirmation: Not complete" },
      { text: `Current stage: ${stage}` }
    ]);
  };

  // Show help messages based on current stage
  const showHelpForCurrentStage = () => {
    const baseCommands = [
      { text: "Available commands:", type: 'system' as MessageType },
      { text: "  clear - Clear terminal" },
      { text: "  back  - Go back to previous step" },
      { text: "  cancel - Cancel registration" },
      { text: "  status - Show registration progress" },
      { text: "  help  - Show this help message" },
      { text: "" }
    ];
    
    const stageSpecificHelp: Record<SignupStage, TerminalMessage[]> = {
      'init': [],
      'username': [
        { text: "Username requirements:", type: 'info' },
        { text: "  - 3-20 characters long" },
        { text: "  - Only letters, numbers, and underscores" },
        { text: "  - No spaces or special characters" },
        { text: "" }
      ],
      'email': [
        { text: "Please enter a valid email address.", type: 'info' },
        { text: "This will be used for account verification and recovery." },
        { text: "" }
      ],
      'password': [
        { text: "Password requirements:", type: 'info' },
        { text: "  - At least 8 characters long" },
        { text: "  - Include at least one uppercase letter" },
        { text: "  - Include at least one number" },
        { text: "" }
      ],
      'confirm-password': [
        { text: "Please re-enter your password to confirm.", type: 'info' },
        { text: "Passwords must match exactly." },
        { text: "" }
      ],
      'terms': [
        { text: "Please review and accept the Terms of Service and Privacy Policy.", type: 'info' },
        { text: "Type 'accept' to agree to the terms and continue." },
        { text: "Type 'view-terms' to read the full terms." },
        { text: "Type 'view-privacy' to read the privacy policy." },
        { text: "" }
      ],
      'processing': [],
      'success': [],
      'failure': []
    };
    
    setTerminalOutput(prev => [
      ...prev,
      ...baseCommands,
      ...stageSpecificHelp[stage]
    ]);
  };

  // Handle the back command based on current stage
  const handleBackCommand = () => {
    switch(stage) {
      case 'email':
        setUsername('');
        setStage('username');
        setTerminalOutput(prev => [
          ...prev,
          { text: "Going back to username entry.", type: 'system' },
          { text: "Please enter your desired username:" }
        ]);
        break;
      case 'password':
        setEmail('');
        setStage('email');
        setTerminalOutput(prev => [
          ...prev,
          { text: "Going back to email entry.", type: 'system' },
          { text: "Please enter your email address:" }
        ]);
        break;
      case 'confirm-password':
        setPassword('');
        setStage('password');
        setTerminalOutput(prev => [
          ...prev,
          { text: "Going back to password entry.", type: 'system' },
          { text: "Please enter your password:" }
        ]);
        break;
      case 'terms':
        setConfirmPassword('');
        setStage('confirm-password');
        setTerminalOutput(prev => [
          ...prev,
          { text: "Going back to password confirmation.", type: 'system' },
          { text: "Please confirm your password:" }
        ]);
        break;
      default:
        setTerminalOutput(prev => [
          ...prev,
          { text: "Cannot go back from current stage.", type: 'error' }
        ]);
    }
  };

  // Handle username input
  const handleUsernameInput = (input: string) => {
    if (input.toLowerCase() === 'register' || input.toLowerCase() === 'signup') {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Starting registration process...", type: 'system' },
        { text: "Please enter your desired username:" }
      ]);
      return;
    }
    
    if (!input.trim()) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Username cannot be empty.", type: 'error' },
        { text: "Please enter your desired username:" }
      ]);
      return;
    }
    
    if (!isValidUsername(input)) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Invalid username format.", type: 'error' },
        { text: "Username must be 3-20 characters and contain only letters, numbers, and underscores." },
        { text: "Please enter a valid username:" }
      ]);
      return;
    }
    
    // Username is valid, proceed to email
    setUsername(input);
    setTerminalOutput(prev => [
      ...prev,
      { text: `Username '${input}' is valid.`, type: 'success', animate: true },
      { text: "Please enter your email address:" }
    ]);
    setStage('email');
  };

  // Handle email input
  const handleEmailInput = (input: string) => {
    if (!input.trim()) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Email cannot be empty.", type: 'error' },
        { text: "Please enter your email address:" }
      ]);
      return;
    }
    
    if (!isValidEmail(input)) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Invalid email format.", type: 'error' },
        { text: "Please enter a valid email address:" }
      ]);
      return;
    }
    
    // Email is valid, proceed to password
    setEmail(input);
    setTerminalOutput(prev => [
      ...prev,
      { text: `Email '${input}' is valid.`, type: 'success', animate: true },
      { text: "Please enter your password:", type: 'info' },
      { text: "(Must be at least 8 characters with uppercase and numbers)" }
    ]);
    setStage('password');
  };

  // Handle password input
  const handlePasswordInput = (input: string) => {
    if (!input.trim()) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Password cannot be empty.", type: 'error' },
        { text: "Please enter your password:" }
      ]);
      return;
    }
    
    if (!isStrongPassword(input)) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Password does not meet security requirements.", type: 'error' },
        { text: "Password must be at least 8 characters with uppercase and numbers." },
        { text: "Please enter a stronger password:" }
      ]);
      return;
    }
    
    // Password is strong, proceed to confirmation
    setPassword(input);
    setTerminalOutput(prev => [
      ...prev,
      { text: "Password is secure.", type: 'success', animate: true },
      { text: "Please confirm your password:" }
    ]);
    setStage('confirm-password');
  };

  // Handle password confirmation
  const handleConfirmPasswordInput = (input: string) => {
    if (input !== password) {
      setTerminalOutput(prev => [
        ...prev,
        { text: "Error: Passwords do not match.", type: 'error' },
        { text: "Please confirm your password again:" }
      ]);
      return;
    }
    
    // Passwords match, proceed to terms
    setConfirmPassword(input);
    setTerminalOutput(prev => [
      ...prev,
      { text: "Passwords match.", type: 'success', animate: true },
      { text: "" },
      { text: "Terms of Service and Privacy Policy:", type: 'system' },
      { text: "---------------------------------------" },
      { text: "By creating an account, you agree to our Terms of Service and Privacy Policy." },
      { text: "These govern your use of Sp1sh and explain how we collect and use your data." },
      { text: "" },
      { text: "Type 'accept' to agree and create your account.", type: 'info' },
      { text: "Type 'view-terms' to read the full Terms of Service." },
      { text: "Type 'view-privacy' to read the Privacy Policy." }
    ]);
    setStage('terms');
  };

  // Handle terms acceptance
  const handleTermsInput = (input: string) => {
    if (input.toLowerCase() === 'view-terms') {
      setTerminalOutput(prev => [
        ...prev,
        { text: "" },
        { text: "Terms of Service (Summary):", type: 'system' },
        { text: "------------------------" },
        { text: "1. Sp1sh provides shell script repository services 'as is'" },
        { text: "2. You are responsible for scripts you upload and run" },
        { text: "3. Prohibited uses include illegal activities and malicious intent" },
        { text: "4. We may terminate accounts for violations" },
        { text: "" },
        { text: "Type 'accept' to agree to the terms and create your account." },
        { text: "Type 'view-privacy' to read the privacy policy." },
        { text: "" }
      ]);
      return;
    }
    
    if (input.toLowerCase() === 'view-privacy') {
      setTerminalOutput(prev => [
        ...prev,
        { text: "" },
        { text: "Privacy Policy (Summary):", type: 'system' },
        { text: "-----------------------" },
        { text: "1. We collect account information and usage data" },
        { text: "2. Data is used to improve services and recommendations" },
        { text: "3. We use industry-standard security practices" },
        { text: "4. You can request data export or deletion" },
        { text: "" },
        { text: "Type 'accept' to agree to the terms and create your account." },
        { text: "" }
      ]);
      return;
    }
    
    if (input.toLowerCase() !== 'accept' && input.toLowerCase() !== 'agree' && input.toLowerCase() !== 'yes') {
      setTerminalOutput(prev => [
        ...prev,
        { text: "To create your account, you must accept the Terms of Service and Privacy Policy.", type: 'error' },
        { text: "Type 'accept' to agree or 'cancel' to exit registration." }
      ]);
      return;
    }
    
    // Terms accepted, process registration
    setTerminalOutput(prev => [
      ...prev,
      { text: "Terms accepted. Processing registration...", type: 'system', animate: true },
      { text: "" }
    ]);
    setStage('processing');
    
    // Simulate registration process
    setTimeout(() => {
      processRegistration();
    }, 2000);
  };

  // Process registration (mock implementation)
  const processRegistration = () => {
    // This would be an API call in a real application
    
    // Simulate successful registration
    setTerminalOutput(prev => [
      ...prev, 
      { text: "Creating secure user profile...", type: 'system' },
      { text: "Generating access credentials...", type: 'system' },
      { text: "Configuring repository permissions...", type: 'system' },
      { text: "Registration successful!", type: 'success', animate: true },
      { text: "" },
      { text: `Welcome to Sp1sh, ${username}!`, type: 'success', animate: true },
      { text: "Your account has been created successfully." },
      { text: "Redirecting to dashboard..." }
    ]);
    setStage('success');
    
    // Notify parent component
    if (onSignupSuccess) {
      setTimeout(() => {
        onSignupSuccess();
      }, 1500);
    }
  };

  // Reset the form
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Helper function to get text style based on message type
  const getMessageStyle = (type?: MessageType): string => {
    switch (type) {
      case 'system':
        return 'text-purple-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-500';
      case 'info':
        return 'text-cyan-400';
      case 'command':
        return 'text-terminal-green';
      default:
        return '';
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
        <div className="ml-4 text-xs text-gray-400">secure_signup.sh</div>
        <div className="ml-auto mr-2 flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
          <span>ENCRYPTED</span>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="bg-gray-700 h-0.5">
        <div 
          className="bg-green-500 h-0.5 transition-all duration-500 ease-out"
          style={{ width: `${progressIndicator}%` }}
        ></div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="terminal-body h-[70vh] min-h-[500px] p-4 md:p-6 font-mono text-sm text-terminal-text overflow-y-auto"
      >
        {/* Terminal Output */}
        {terminalOutput.map((message, index) => (
          message.animate ? (
            <motion.div 
              key={index} 
              className={`terminal-line ${getMessageStyle(message.type)}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.text}
            </motion.div>
          ) : (
            <div key={index} className={`terminal-line ${getMessageStyle(message.type)}`}>
              {message.text}
            </div>
          )
        ))}
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 my-1">{error}</div>
        )}
        
        {/* Input Command Line */}
        <AnimatePresence mode="wait">
          {!isTyping && stage !== 'processing' && stage !== 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-1"
            >
              <CommandInput 
                prompt={stage === 'password' || stage === 'confirm-password' ? 'password >' : '>'} 
                type={stage === 'password' || stage === 'confirm-password' ? 'password' : 'text'}
                onSubmit={handleCommand}
                placeholder={getPlaceholderForStage(stage)}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Processing Animation */}
        {stage === 'processing' && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse mr-2">▋</div>
            <span>Processing registration...</span>
          </div>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="terminal-footer py-2 px-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {(stage === 'password' || stage === 'confirm-password') ? 'Secure mode: enabled' : 'Type "help" for assistance'}
        </div>
        <Link href="/signin" className="text-xs text-primary hover:underline">
          Existing account? Log in
        </Link>
      </div>
    </div>
  );
};

// Helper function to get placeholder text based on current stage
const getPlaceholderForStage = (stage: SignupStage): string => {
  switch (stage) {
    case 'username':
      return 'Enter desired username';
    case 'email':
      return 'Enter email address';
    case 'password':
      return 'Enter secure password';
    case 'confirm-password':
      return 'Confirm password';
    case 'terms':
      return 'Type "accept" to agree';
    default:
      return '';
  }
};

export default TerminalSignup;