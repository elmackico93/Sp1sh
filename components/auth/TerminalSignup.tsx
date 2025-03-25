import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  | 'verification'
  | 'success' 
  | 'failure';

// Form validation utility functions
const isValidUsername = (username: string): boolean => 
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

const isValidEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getPasswordStrength = (password: string): {
  score: number;
  feedback: string;
  color: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Password should be at least 8 characters");
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include uppercase letters");
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include lowercase letters");
  }
  
  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include numbers");
  }
  
  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include special characters");
  }
  
  // Determine color based on score
  let color = "";
  if (score <= 1) {
    color = "text-red-500";
  } else if (score <= 3) {
    color = "text-yellow-500";
  } else {
    color = "text-green-400";
  }
  
  return {
    score,
    feedback: feedback.join(", "),
    color
  };
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
  const [terminalOutput, setTerminalOutput] = useState<Array<{text: string; type?: string}>>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentTypingLine, setCurrentTypingLine] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [progressIndicator, setProgressIndicator] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [autoCommandTimeout, setAutoCommandTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Initial welcome messages
  const welcomeLines = [
    { text: "Sp1sh Secure Access Terminal v3.7.2" },
    { text: "-------------------------------" },
    { text: "Welcome to the Sp1sh shell script repository." },
    { text: "Initializing secure registration protocol...", type: "system" },
    { text: "Connection encrypted with AES-256", type: "success" },
    { text: "" },
    { text: "Type 'help' for assistance or 'register' to begin.", type: "info" },
    { text: "" },
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
      
      // Auto-type "help" command after 1.5 seconds if user hasn't interacted
      const timeout = setTimeout(() => {
        addOutput({ text: "> help", type: "command" });
        showHelpForCurrentStage();
      }, 1500);
      
      setAutoCommandTimeout(timeout);
      
      return () => {
        if (autoCommandTimeout) clearTimeout(autoCommandTimeout);
      };
    }
  }, [isTyping, currentTypingLine]);

  // Progress indicator for registration process
  useEffect(() => {
    // Update progress based on stage
    switch (stage) {
      case 'init':
      case 'username':
        setProgressIndicator(0);
        break;
      case 'email':
        setProgressIndicator(20);
        break;
      case 'password':
        setProgressIndicator(40);
        break;
      case 'confirm-password':
        setProgressIndicator(60);
        break;
      case 'terms':
        setProgressIndicator(80);
        break;
      case 'processing':
      case 'verification':
      case 'success':
        setProgressIndicator(100);
        break;
    }
  }, [stage]);

  // Helper to add a line to the terminal output
  const addOutput = useCallback((line: {text: string; type?: string}) => {
    setTerminalOutput(prev => [...prev, line]);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cancel auto command on any keyboard activity
      if (autoCommandTimeout) {
        clearTimeout(autoCommandTimeout);
        setAutoCommandTimeout(null);
      }
      
      // Handle Ctrl+C to cancel current operation
      if (e.ctrlKey && e.key === 'c') {
        if (stage !== 'init' && stage !== 'processing') {
          addOutput({ text: "^C", type: "system" });
          addOutput({ text: "Operation cancelled", type: "error" });
          resetForm();
          setStage('username');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [stage, addOutput, autoCommandTimeout]);

  // Handle command input
  const handleCommand = (command: string) => {
    // Cancel any auto command on user interaction
    if (autoCommandTimeout) {
      clearTimeout(autoCommandTimeout);
      setAutoCommandTimeout(null);
    }
    
    // Add to command history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Display command in terminal
    addOutput({ text: `> ${command}`, type: "command" });
    
    // Process standard commands
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
      addOutput({ text: "Registration process cancelled.", type: "system" });
      addOutput({ text: "Returning to the main prompt." });
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
        addOutput({ 
          text: "Command not recognized. Type 'help' for assistance.", 
          type: "error" 
        });
    }
  };

  // Show current registration status
  const showStatusCommand = () => {
    const completedSteps = [];
    const pendingSteps = [];
    
    // Determine completed and pending steps
    if (username) completedSteps.push("Username");
    else pendingSteps.push("Username");
    
    if (email) completedSteps.push("Email");
    else pendingSteps.push("Email");
    
    if (password) completedSteps.push("Password");
    else pendingSteps.push("Password");
    
    if (confirmPassword) completedSteps.push("Password confirmation");
    else pendingSteps.push("Password confirmation");
    
    if (stage === 'success') completedSteps.push("Terms acceptance");
    else pendingSteps.push("Terms acceptance");
    
    // Display registration status
    addOutput({ text: "Registration Status:", type: "system" });
    addOutput({ text: `Progress: [${progressIndicator}%]` });
    
    // Create progress bar
    const progressBarWidth = 30;
    const filledBlocks = Math.floor((progressIndicator / 100) * progressBarWidth);
    const emptyBlocks = progressBarWidth - filledBlocks;
    const progressBar = `[${'='.repeat(filledBlocks)}${' '.repeat(emptyBlocks)}]`;
    
    addOutput({ text: progressBar });
    
    // Show completed steps
    if (completedSteps.length > 0) {
      addOutput({ text: "Completed steps:", type: "success" });
      completedSteps.forEach(step => {
        addOutput({ text: `  ✓ ${step}`, type: "success" });
      });
    }
    
    // Show pending steps
    if (pendingSteps.length > 0) {
      addOutput({ text: "Pending steps:", type: "info" });
      pendingSteps.forEach(step => {
        addOutput({ text: `  ○ ${step}` });
      });
    }
    
    // Current stage
    addOutput({ text: `Current stage: ${stage}` });
  };

  // Show help messages based on current stage
  const showHelpForCurrentStage = () => {
    const baseCommands = [
      { text: "Available commands:", type: "system" },
      { text: "  clear - Clear terminal" },
      { text: "  back  - Go back to previous step" },
      { text: "  cancel - Cancel registration" },
      { text: "  status - Show registration progress" },
      { text: "  help  - Show this help message" },
      { text: "" }
    ];
    
    const stageSpecificHelp: Record<SignupStage, Array<{text: string; type?: string}>> = {
      'init': [],
      'username': [
        { text: "Username requirements:", type: "info" },
        { text: "  - 3-20 characters long" },
        { text: "  - Only letters, numbers, and underscores" },
        { text: "  - No spaces or special characters" },
        { text: "" },
        { text: "Type 'register' to start registration process", type: "tip" },
        { text: "" }
      ],
      'email': [
        { text: "Please enter a valid email address.", type: "info" },
        { text: "This will be used for account verification and recovery." },
        { text: "" }
      ],
      'password': [
        { text: "Password requirements:", type: "info" },
        { text: "  - At least 8 characters long" },
        { text: "  - Include at least one uppercase letter" },
        { text: "  - Include at least one lowercase letter" },
        { text: "  - Include at least one number" },
        { text: "  - Special characters recommended" },
        { text: "" }
      ],
      'confirm-password': [
        { text: "Please re-enter your password to confirm.", type: "info" },
        { text: "Passwords must match exactly." },
        { text: "" }
      ],
      'terms': [
        { text: "Please review and accept the Terms of Service and Privacy Policy.", type: "info" },
        { text: "Type 'accept' to agree to the terms and continue." },
        { text: "Type 'view-terms' to read the full terms." },
        { text: "Type 'view-privacy' to read the privacy policy." },
        { text: "" }
      ],
      'processing': [],
      'verification': [],
      'success': [],
      'failure': []
    };
    
    // Add base commands
    baseCommands.forEach(cmd => addOutput(cmd));
    
    // Add stage-specific help
    stageSpecificHelp[stage].forEach(help => addOutput(help));
    
    // Add keyboard shortcuts
    addOutput({ text: "Keyboard shortcuts:", type: "system" });
    addOutput({ text: "  Tab - Auto-complete commands" });
    addOutput({ text: "  ↑/↓ - Navigate command history" });
    addOutput({ text: "  Ctrl+C - Cancel current operation" });
    addOutput({ text: "" });
  };

  // Handle the back command based on current stage
  const handleBackCommand = () => {
    switch(stage) {
      case 'email':
        setUsername('');
        setStage('username');
        addOutput({ text: "Going back to username entry.", type: "system" });
        addOutput({ text: "Please enter your desired username:" });
        break;
      case 'password':
        setEmail('');
        setStage('email');
        addOutput({ text: "Going back to email entry.", type: "system" });
        addOutput({ text: "Please enter your email address:" });
        break;
      case 'confirm-password':
        setPassword('');
        setStage('password');
        addOutput({ text: "Going back to password entry.", type: "system" });
        addOutput({ text: "Please enter your password:" });
        break;
      case 'terms':
        setConfirmPassword('');
        setStage('confirm-password');
        addOutput({ text: "Going back to password confirmation.", type: "system" });
        addOutput({ text: "Please confirm your password:" });
        break;
      default:
        addOutput({ text: "Cannot go back from current stage.", type: "error" });
    }
  };

  // Handle username input
  const handleUsernameInput = (input: string) => {
    if (input.toLowerCase() === 'register' || input.toLowerCase() === 'signup') {
      addOutput({ text: "Starting registration process...", type: "system" });
      addOutput({ text: "Please enter your desired username:" });
      return;
    }
    
    if (!input.trim()) {
      addOutput({ text: "Error: Username cannot be empty.", type: "error" });
      addOutput({ text: "Please enter your desired username:" });
      return;
    }
    
    // Check if username is available (simulate API call)
    if (input.toLowerCase() === 'admin' || input.toLowerCase() === 'root') {
      addOutput({ text: "Error: This username is reserved or already taken.", type: "error" });
      addOutput({ text: "Please try a different username:" });
      return;
    }
    
    if (!isValidUsername(input)) {
      addOutput({ text: "Error: Invalid username format.", type: "error" });
      addOutput({ text: "Username must be 3-20 characters and contain only letters, numbers, and underscores." });
      addOutput({ text: "Please enter a valid username:" });
      return;
    }
    
    // Username is valid, proceed to email
    setUsername(input);
    addOutput({ text: `Username '${input}' is valid and available.`, type: "success" });
    addOutput({ text: "Please enter your email address:" });
    setStage('email');
  };

  // Handle email input
  const handleEmailInput = (input: string) => {
    if (!input.trim()) {
      addOutput({ text: "Error: Email cannot be empty.", type: "error" });
      addOutput({ text: "Please enter your email address:" });
      return;
    }
    
    if (!isValidEmail(input)) {
      addOutput({ text: "Error: Invalid email format.", type: "error" });
      addOutput({ text: "Please enter a valid email address:" });
      return;
    }
    
    // Email is valid, proceed to password
    setEmail(input);
    addOutput({ text: `Email '${input}' is valid.`, type: "success" });
    addOutput({ text: "Please enter your password:", type: "system" });
    addOutput({ text: "(Must be at least 8 characters with uppercase and numbers)" });
    setStage('password');
  };

  // Handle password input
  const handlePasswordInput = (input: string) => {
    if (!input.trim()) {
      addOutput({ text: "Error: Password cannot be empty.", type: "error" });
      addOutput({ text: "Please enter your password:" });
      return;
    }
    
    // Check password strength
    const { score, feedback, color } = getPasswordStrength(input);
    
    // Show password strength feedback
    addOutput({ text: `Password strength: [${score}/5]`, type: color === "text-green-400" ? "success" : "system" });
    
    // Create visual password strength meter
    const strengthMeter = "■".repeat(score) + "□".repeat(5 - score);
    addOutput({ text: strengthMeter, type: color });
    
    if (score < 3) {
      addOutput({ text: `Weak password. ${feedback}`, type: "error" });
      addOutput({ text: "Please use a stronger password:" });
      return;
    }
    
    // Password is strong enough, proceed to confirmation
    setPassword(input);
    addOutput({ text: "Password strength is acceptable.", type: "success" });
    addOutput({ text: "Please confirm your password:" });
    setStage('confirm-password');
  };

  // Handle password confirmation
  const handleConfirmPasswordInput = (input: string) => {
    if (input !== password) {
      addOutput({ text: "Error: Passwords do not match.", type: "error" });
      addOutput({ text: "Please confirm your password again:" });
      return;
    }
    
    // Passwords match, proceed to terms
    setConfirmPassword(input);
    addOutput({ text: "Passwords match.", type: "success" });
    addOutput({ text: "" });
    addOutput({ text: "Terms of Service and Privacy Policy:", type: "system" });
    addOutput({ text: "---------------------------------------" });
    addOutput({ text: "By creating an account, you agree to our Terms of Service and Privacy Policy." });
    addOutput({ text: "These govern your use of Sp1sh and explain how we collect and use your data." });
    addOutput({ text: "" });
    addOutput({ text: "Type 'accept' to agree and create your account." });
    addOutput({ text: "Type 'view-terms' to read the full Terms of Service." });
    addOutput({ text: "Type 'view-privacy' to read the Privacy Policy." });
    setStage('terms');
  };

  // Handle terms acceptance
  const handleTermsInput = (input: string) => {
    if (input.toLowerCase() === 'view-terms') {
      addOutput({ text: "" });
      addOutput({ text: "Terms of Service (Summary):", type: "system" });
      addOutput({ text: "------------------------" });
      addOutput({ text: "1. Sp1sh provides shell script repository services 'as is'" });
      addOutput({ text: "2. You are responsible for scripts you upload and run" });
      addOutput({ text: "3. Prohibited uses include illegal activities and malicious intent" });
      addOutput({ text: "4. We may terminate accounts for violations" });
      addOutput({ text: "" });
      addOutput({ text: "Type 'accept' to agree to the terms and create your account." });
      addOutput({ text: "Type 'view-privacy' to read the privacy policy." });
      addOutput({ text: "" });
      return;
    }
    
    if (input.toLowerCase() === 'view-privacy') {
      addOutput({ text: "" });
      addOutput({ text: "Privacy Policy (Summary):", type: "system" });
      addOutput({ text: "-----------------------" });
      addOutput({ text: "1. We collect account information and usage data" });
      addOutput({ text: "2. Data is used to improve services and recommendations" });
      addOutput({ text: "3. We use industry-standard security practices" });
      addOutput({ text: "4. You can request data export or deletion" });
      addOutput({ text: "" });
      addOutput({ text: "Type 'accept' to agree to the terms and create your account." });
      addOutput({ text: "" });
      return;
    }
    
    if (input.toLowerCase() !== 'accept' && input.toLowerCase() !== 'agree' && input.toLowerCase() !== 'yes') {
      addOutput({ text: "To create your account, you must accept the Terms of Service and Privacy Policy.", type: "error" });
      addOutput({ text: "Type 'accept' to agree or 'cancel' to exit registration." });
      return;
    }
    
    // Terms accepted, process registration
    addOutput({ text: "Terms accepted. Processing registration...", type: "system" });
    addOutput({ text: "" });
    setStage('processing');
    
    // Simulate verification email process
    setTimeout(() => {
      processRegistration();
    }, 2000);
  };

  // Process registration
  const processRegistration = () => {
    // Show processing steps with realistic delays
    const processingSteps = [
      { text: "Creating secure user profile...", delay: 500 },
      { text: "Generating access credentials...", delay: 700 },
      { text: "Configuring repository permissions...", delay: 600 },
      { text: "Setting up encryption keys...", delay: 800 },
      { text: "Registration complete!", delay: 500, type: "success" }
    ];
    
    let totalDelay = 0;
    
    processingSteps.forEach((step, index) => {
      totalDelay += step.delay;
      setTimeout(() => {
        addOutput({ text: step.text, type: step.type });
        
        // After all processing steps, move to verification
        if (index === processingSteps.length - 1) {
          setStage('verification');
          simulateVerificationEmail();
        }
      }, totalDelay);
    });
  };
  
  // Simulate email verification
  const simulateVerificationEmail = () => {
    setTimeout(() => {
      addOutput({ text: "" });
      addOutput({ text: "Verification email sent to " + email, type: "system" });
      addOutput({ text: "Check your inbox to activate your account." });
      
      // Simulate user verifying their email
      setTimeout(() => {
        addOutput({ text: "" });
        addOutput({ text: "Email verification detected!", type: "success" });
        addOutput({ text: "" });
        addOutput({ text: `Welcome to Sp1sh, ${username}!`, type: "success" });
        addOutput({ text: "Your account has been created and activated successfully." });
        addOutput({ text: "Redirecting to dashboard..." });
        addOutput({ text: "" });
        setStage('success');
        
        // Notify parent component
        if (onSignupSuccess) {
          setTimeout(() => {
            onSignupSuccess();
          }, 1500);
        }
      }, 3000);
    }, 1000);
  };

  // Reset the form
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // Get appropriate styling based on message type
  const getLineStyle = (type?: string): string => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-cyan-400';
      case 'system':
        return 'text-purple-400';
      case 'command':
        return 'text-terminal-green font-bold';
      case 'tip':
        return 'text-blue-400';
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
      <div className="bg-gray-700 h-1">
        <div 
          className="bg-green-500 h-1 transition-all duration-500 ease-out"
          style={{ width: `${progressIndicator}%` }}
        ></div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="terminal-body h-[70vh] min-h-[500px] p-4 md:p-6 font-mono text-sm text-terminal-text overflow-y-auto terminal-scrollbar"
      >
        {/* Terminal Output */}
        {terminalOutput.map((line, index) => (
          <div key={index} className={`terminal-line ${getLineStyle(line.type)}`}>
            {line.text}
          </div>
        ))}
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 my-1">{error}</div>
        )}
        
        {/* Input Command Line */}
        <AnimatePresence mode="wait">
          {!isTyping && stage !== 'processing' && stage !== 'verification' && stage !== 'success' && (
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
                history={commandHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Processing Animation */}
        {(stage === 'processing' || stage === 'verification') && (
          <div className="flex items-center mt-2">
            <div className="animate-pulse mr-2">▋</div>
            <span>{stage === 'verification' ? 'Awaiting verification...' : 'Processing registration...'}</span>
          </div>
        )}
      </div>
      
      {/* Bottom Bar */}
      <div className="terminal-footer py-2 px-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400">
          {(stage === 'password' || stage === 'confirm-password') 
            ? 'Secure mode: enabled' 
            : stage === 'processing' 
              ? 'Creating account...'
              : stage === 'verification'
                ? 'Verification pending...'
                : 'Type "help" for assistance'}
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