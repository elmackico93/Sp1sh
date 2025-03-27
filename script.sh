#!/bin/bash

# ===================================================================
# Complete Terminal UI Integration Script for SP1SH
# ===================================================================
#
# This script autonomously completes all integration steps for the 
# terminal UI theme in your SP1SH codebase.
#
# It performs the following actions:
# 1. Adds import to globals.css
# 2. Updates signin.tsx and signup.tsx
# 3. Ensures _app.tsx has ThemeProvider
#
# Usage: ./complete-terminal-integration.sh [--force]

# Exit on any error
set -e

# Text formatting
BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
MAGENTA="\e[35m"
CYAN="\e[36m"
RESET="\e[0m"

# Script configuration
SOURCE_DIR="./tu"
BACKUP_DIR="./tu/backups/integration-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="./tu/logs/integration-$(date +%Y%m%d-%H%M%S).log"
GLOBALS_CSS="./styles/globals.css"
SIGNIN_TSX="./pages/signin.tsx"
SIGNUP_TSX="./pages/signup.tsx"
APP_TSX="./pages/_app.tsx"
TEMP_DIR=$(mktemp -d)

# State variables
FORCE_MODE=false

# Function to log messages
log() {
  local level=$1
  local message=$2
  
  # Ensure logs directory exists
  mkdir -p "$(dirname "$LOG_FILE")"
  
  # Write to log file
  echo "[$(date "+%Y-%m-%d %H:%M:%S")] [${level}] ${message}" >> "$LOG_FILE"
  
  # Output to console
  case $level in
    "INFO")
      echo -e "${BLUE}[INFO] ${message}${RESET}"
      ;;
    "WARNING")
      echo -e "${YELLOW}[WARNING] ${message}${RESET}"
      ;;
    "ERROR")
      echo -e "${RED}[ERROR] ${message}${RESET}"
      ;;
    "SUCCESS")
      echo -e "${GREEN}[SUCCESS] ${message}${RESET}"
      ;;
    *)
      echo -e "[${level}] ${message}"
      ;;
  esac
}

# Function to confirm action
confirm() {
  if [ "$FORCE_MODE" = true ]; then
    return 0
  fi
  
  local prompt="$1"
  read -p "${prompt} [y/N]: " response
  
  case "$response" in
    [yY][eE][sS]|[yY]) 
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Function to back up a file
backup_file() {
  local file="$1"
  
  if [ ! -f "$file" ]; then
    log "WARNING" "File does not exist, no backup needed: ${file}"
    return 0
  fi
  
  # Ensure backup directory structure exists
  local dir_path=$(dirname "$file")
  local backup_path="${BACKUP_DIR}/${dir_path}"
  mkdir -p "$backup_path"
  
  # Copy file with preserved attributes
  cp -p "$file" "${BACKUP_DIR}/${file}"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Backed up: ${file} -> ${BACKUP_DIR}/${file}"
    return 0
  else
    log "ERROR" "Failed to back up file: ${file}"
    return 1
  fi
}

# Function to update globals.css
update_globals_css() {
  log "INFO" "Updating globals.css"
  
  if [ ! -f "$GLOBALS_CSS" ]; then
    log "ERROR" "globals.css file not found at: ${GLOBALS_CSS}"
    return 1
  fi
  
  # Check if the import is already present
  if grep -q "@import './terminal-theme.css';" "$GLOBALS_CSS"; then
    log "INFO" "Import already exists in globals.css, skipping"
    return 0
  fi
  
  # Back up the file
  backup_file "$GLOBALS_CSS"
  
  # Add import at the top of the file
  echo "@import './terminal-theme.css';" | cat - "$GLOBALS_CSS" > "${TEMP_DIR}/globals.css"
  cp "${TEMP_DIR}/globals.css" "$GLOBALS_CSS"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Added import to globals.css"
    return 0
  else
    log "ERROR" "Failed to update globals.css"
    return 1
  fi
}

# Function to replace signin.tsx with the correct implementation
update_signin_tsx() {
  log "INFO" "Updating signin.tsx"
  
  if [ ! -f "$SIGNIN_TSX" ]; then
    log "ERROR" "signin.tsx file not found at: ${SIGNIN_TSX}"
    return 1
  fi
  
  # Check source file exists
  local source_file="${SOURCE_DIR}/terminal-implementation.tsx"
  if [ ! -f "$source_file" ]; then
    log "ERROR" "Source implementation file not found at: ${source_file}"
    return 1
  fi
  
  # Back up the destination file
  backup_file "$SIGNIN_TSX"
  
  # Create a SignIn component file directly using the implementation
  cat > "${TEMP_DIR}/signin.tsx" << 'EOL'
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import TerminalLogin from '@/components/auth/TerminalLogin';
import EnhancedMatrixBackground from '@/components/auth/EnhancedMatrixBackground';
import KeyboardShortcuts from '@/components/auth/KeyboardShortcuts';
import TerminalThemeProvider from '@/components/auth/TerminalThemeProvider';
import TerminalThemeSwitcher from '@/components/auth/TerminalThemeSwitcher';

// Define authentication states
type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  const { redirect } = router.query;
  
  // Parse the destination URL to redirect after login
  const redirectPath = typeof redirect === 'string' ? redirect : '/';
  
  // Simulate a system boot sequence
  useEffect(() => {
    // Show boot animation for 2 seconds
    const bootTimer = setTimeout(() => {
      setBootSequence(false);
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(bootTimer);
  }, []);

  // Handle successful login
  const handleLoginSuccess = useCallback(() => {
    // Update auth status
    setAuthStatus('authenticated');
    setIsLoading(true);
    
    // Show success message for 1.5 seconds before redirecting
    const redirectTimer = setTimeout(() => {
      router.push(redirectPath);
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [router, redirectPath]);

  // Handle login errors
  const handleLoginError = useCallback((error: string) => {
    setAuthStatus('error');
    setAuthError(error);
    
    // Reset error state after 3 seconds
    const errorTimer = setTimeout(() => {
      setAuthStatus('idle');
      setAuthError(null);
    }, 3000);
    
    return () => clearTimeout(errorTimer);
  }, []);

  return (
    <TerminalThemeProvider>
      <Head>
        <title>Sign In | Sp1sh</title>
        <meta name="description" content="Access your Sp1sh shell script repository account" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
        {/* Enhanced Matrix Background */}
        <EnhancedMatrixBackground density={0.8} speed={1.0} glowIntensity={0.7} />
        
        {/* Theme Switcher */}
        <TerminalThemeSwitcher />
        
        {/* Terminal window container */}
        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {/* Boot Sequence Animation */}
            {bootSequence ? (
              <motion.div
                key="boot"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="terminal-window bg-terminal-bg border border-gray-700 rounded-lg shadow-2xl overflow-hidden terminal-flicker"
              >
                <div className="terminal-header flex items-center p-2 bg-gray-800">
                  <div className="flex gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">sp1sh_sys_access.sh</div>
                </div>
                
                <div className="p-4 font-mono text-sm text-terminal-text relative">
                  {/* Scan line effect */}
                  <div className="terminal-scan-line"></div>
                  
                  <p className="mb-1">Sp1sh Security Terminal v3.7.2</p>
                  <p className="mb-1">Initializing system... <span className="text-green-400">OK</span></p>
                  <p className="mb-1">Checking network integrity... <span className="text-green-400">SECURE</span></p>
                  <p className="mb-1">Loading secure authentication module...</p>
                  <div className="flex items-center mt-2">
                    <div className="animate-pulse mr-2">▋</div>
                    <div className="h-1 w-full bg-gray-700 rounded">
                      <div className="h-1 bg-green-500 rounded animate-terminal-load"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TerminalLogin 
                  isLoading={isLoading}
                  onLoginSuccess={handleLoginSuccess}
                  onLoginError={handleLoginError}
                />
                
                {/* Sign-up link */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    New to Sp1sh? <Link href="/signup" className="text-primary hover:underline">Create account</Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Authentication error toast */}
          <AnimatePresence>
            {authStatus === 'error' && authError && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white px-4 py-2 rounded shadow-lg text-sm font-mono terminal-error-anim"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Show keyboard shortcuts only when not in boot sequence and not loading */}
        {!bootSequence && !isLoading && <KeyboardShortcuts />}
      </div>
    </TerminalThemeProvider>
  );
}
EOL

  # Copy the file to destination
  cp "${TEMP_DIR}/signin.tsx" "$SIGNIN_TSX"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Updated signin.tsx with terminal UI implementation"
    return 0
  else
    log "ERROR" "Failed to update signin.tsx"
    return 1
  fi
}

# Function to update signup.tsx with the correct implementation
update_signup_tsx() {
  log "INFO" "Updating signup.tsx"
  
  if [ ! -f "$SIGNUP_TSX" ]; then
    log "ERROR" "signup.tsx file not found at: ${SIGNUP_TSX}"
    return 1
  fi
  
  # Check source file exists
  local source_file="${SOURCE_DIR}/terminal-implementation.tsx"
  if [ ! -f "$source_file" ]; then
    log "ERROR" "Source implementation file not found at: ${source_file}"
    return 1
  fi
  
  # Back up the destination file
  backup_file "$SIGNUP_TSX"
  
  # Create a SignUp component file directly
  cat > "${TEMP_DIR}/signup.tsx" << 'EOL'
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import TerminalSignup from '@/components/auth/TerminalSignup';
import EnhancedMatrixBackground from '@/components/auth/EnhancedMatrixBackground';
import KeyboardShortcuts from '@/components/auth/KeyboardShortcuts';
import TerminalThemeProvider from '@/components/auth/TerminalThemeProvider';
import TerminalThemeSwitcher from '@/components/auth/TerminalThemeSwitcher';

// Define authentication states
type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bootSequence, setBootSequence] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [authError, setAuthError] = useState<string | null>(null);
  const { redirect } = router.query;
  
  // Parse the destination URL to redirect after signup
  const redirectPath = typeof redirect === 'string' ? redirect : '/';
  
  // Simulate a system boot sequence
  useEffect(() => {
    // Check for browser capabilities for a more personalized experience
    const checkSystemCapabilities = () => {
      const capabilities = {
        webGL: checkWebGL(),
        localStorage: checkLocalStorage(),
        sessionStorage: checkSessionStorage(),
        cookies: navigator.cookieEnabled,
        connection: navigator.onLine ? 'online' : 'offline',
        cores: navigator.hardwareConcurrency || 'unknown',
        language: navigator.language,
        userAgent: navigator.userAgent,
      };
      
      return capabilities;
    };
    
    // Log system capabilities for terminal display (would be shown in a real implementation)
    const systemInfo = checkSystemCapabilities();
    console.log('System capabilities:', systemInfo);
    
    // Show boot animation for adjusted time (shorter on faster devices)
    const bootTimer = setTimeout(() => {
      setBootSequence(false);
      setIsLoading(false);
    }, systemInfo.cores && systemInfo.cores > 4 ? 1500 : 2000);
    
    return () => clearTimeout(bootTimer);
  }, []);

  // Handle successful signup
  const handleSignupSuccess = useCallback(() => {
    // Update auth status
    setAuthStatus('authenticated');
    setIsLoading(true);
    
    // Show success message for 1.5 seconds before redirecting
    const redirectTimer = setTimeout(() => {
      router.push(redirectPath);
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [router, redirectPath]);

  // Handle signup errors
  const handleSignupError = useCallback((error: string) => {
    setAuthStatus('error');
    setAuthError(error);
    
    // Reset error state after 3 seconds
    const errorTimer = setTimeout(() => {
      setAuthStatus('idle');
      setAuthError(null);
    }, 3000);
    
    return () => clearTimeout(errorTimer);
  }, []);
  
  // Utility functions for system capability checks
  const checkWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  };
  
  const checkLocalStorage = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const checkSessionStorage = () => {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <TerminalThemeProvider>
      <Head>
        <title>Sign Up | Sp1sh</title>
        <meta name="description" content="Create your Sp1sh shell script repository account" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
        {/* Enhanced Matrix Background with adjusted settings for signup page */}
        <EnhancedMatrixBackground density={0.85} speed={0.9} glowIntensity={0.8} />
        
        {/* Theme Switcher */}
        <TerminalThemeSwitcher />
        
        {/* Terminal window container */}
        <div className="w-full max-w-lg relative z-10">
          <AnimatePresence mode="wait">
            {/* Boot Sequence Animation */}
            {bootSequence ? (
              <motion.div
                key="boot"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="terminal-window bg-terminal-bg border border-gray-700 rounded-lg shadow-2xl overflow-hidden terminal-flicker"
              >
                <div className="terminal-header flex items-center p-2 bg-gray-800">
                  <div className="flex gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">sp1sh_new_user.sh</div>
                </div>
                
                <div className="p-4 font-mono text-sm text-terminal-text relative">
                  {/* Scan line effect */}
                  <div className="terminal-scan-line"></div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="mb-1">Sp1sh Security Terminal v3.7.2</p>
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 0.3 }}
                      className="mb-1"
                    >
                      Initializing system... <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-green-400"
                      >
                        OK
                      </motion.span>
                    </motion.p>
                    
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.1 }}
                      className="mb-1"
                    >
                      Checking network integrity... <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="text-green-400"
                      >
                        SECURE
                      </motion.span>
                    </motion.p>
                    
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.7 }}
                      className="mb-1"
                    >
                      Loading registration module...
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1.9 }}
                      className="flex items-center mt-2"
                    >
                      <div className="animate-pulse mr-2">▋</div>
                      <div className="h-1 w-full bg-gray-700 rounded">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 1.9, duration: 1.5 }}
                          className="h-1 bg-green-500 rounded"
                        ></motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TerminalSignup 
                  isLoading={isLoading}
                  onSignupSuccess={handleSignupSuccess}
                  onSignupError={handleSignupError}
                />
                
                {/* Login link */}
                <div className="mt-4 text-center">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-400"
                  >
                    Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
                  </motion.p>
                </div>
                
                {/* Social login options */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center"
                >
                  <p className="text-xs text-gray-500 mb-2">Or continue with</p>
                  <div className="flex justify-center gap-4">
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-[#1877F2] hover:bg-[#0c64d8] rounded-full transition-colors">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.644c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.899 10.126-5.864 10.126-11.854z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Authentication error toast */}
          <AnimatePresence>
            {authStatus === 'error' && authError && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white px-4 py-2 rounded shadow-lg text-sm font-mono"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {authError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Show keyboard shortcuts only when not in boot sequence and not loading */}
        {!bootSequence && !isLoading && <KeyboardShortcuts />}
        
        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-4 right-4 bg-gray-900/70 backdrop-blur-sm text-xs text-gray-400 px-3 py-1.5 rounded-full flex items-center"
        >
          <svg className="w-4 h-4 mr-1.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>256-bit Encrypted Connection</span>
        </motion.div>
      </div>
    </TerminalThemeProvider>
  );
}
EOL

  # Copy the file to destination
  cp "${TEMP_DIR}/signup.tsx" "$SIGNUP_TSX"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Updated signup.tsx with terminal UI implementation"
    return 0
  else
    log "ERROR" "Failed to update signup.tsx"
    return 1
  fi
}

# Function to update _app.tsx
update_app_tsx() {
  log "INFO" "Checking _app.tsx"
  
  if [ ! -f "$APP_TSX" ]; then
    log "ERROR" "_app.tsx file not found at: ${APP_TSX}"
    return 1
  fi
  
  # Check if ThemeProvider is already present
  if grep -q "ThemeProvider" "$APP_TSX"; then
    log "INFO" "ThemeProvider already exists in _app.tsx, skipping"
    return 0
  fi
  
  # Back up the file
  backup_file "$APP_TSX"
  
  # Create temp file for manipulating content
  local temp_file="${TEMP_DIR}/app.tsx"
  
  # Read the content of _app.tsx
  cat "$APP_TSX" > "$temp_file"
  
  # Add ThemeProvider import if not present
  if ! grep -q "import { ThemeProvider } from 'next-themes';" "$temp_file"; then
    # Create a new file with the import added
    sed -i '1i import { ThemeProvider } from '\''next-themes'\'';' "$temp_file"
  fi
  
  # Add ThemeProvider wrapper around Component
  # This is a more direct approach that avoids the complex awk patterns
  sed -i 's/<Component\(.*\)props\(.*\)\/>/\<ThemeProvider attribute="class">\n      <Component\1props\2\/>\n    <\/ThemeProvider>/g' "$temp_file"
  
  # Copy the modified file back
  cp "$temp_file" "$APP_TSX"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Added ThemeProvider to _app.tsx"
    return 0
  else
    log "ERROR" "Failed to update _app.tsx"
    return 1
  fi
}

# Process command line arguments
for arg in "$@"; do
  case $arg in
    --force)
      FORCE_MODE=true
      ;;
    *)
      echo -e "${RED}Unknown argument: $arg${RESET}"
      echo "Usage: $(basename "$0") [--force]"
      exit 1
      ;;
  esac
done

# Main function
main() {
  # Print banner
  echo -e "${BOLD}${CYAN}"
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║                                                        ║"
  echo "║     Complete SP1SH Terminal UI Integration             ║"
  echo "║                                                        ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  
  # Check if source directory exists
  if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}Error: Source directory '$SOURCE_DIR' not found.${RESET}"
    echo "Please ensure you've installed the terminal UI components to the 'tu' directory."
    exit 1
  fi
  
  # Create backup directory
  mkdir -p "$BACKUP_DIR"
  
  # Confirm changes
  echo -e "${YELLOW}This script will autonomously complete the integration of the terminal UI theme:${RESET}"
  echo -e "  ${MAGENTA}• Add terminal theme import to globals.css${RESET}"
  echo -e "  ${MAGENTA}• Update signin.tsx with terminal UI implementation${RESET}"
  echo -e "  ${MAGENTA}• Update signup.tsx with terminal UI implementation${RESET}"
  echo -e "  ${MAGENTA}• Add ThemeProvider to _app.tsx if needed${RESET}"
  echo
  echo -e "${YELLOW}Backups will be created in: ${BACKUP_DIR}${RESET}"
  echo
  
  if ! confirm "Do you want to proceed with these changes?"; then
    echo -e "${YELLOW}Operation cancelled.${RESET}"
    exit 0
  fi
  
  echo
  
  # Clean up temporary directory at exit
  trap 'rm -rf "$TEMP_DIR"' EXIT
  
  # Apply changes
  echo -e "${CYAN}Applying changes...${RESET}"
  
  # Update globals.css
  update_globals_css
  echo
  
  # Update signin.tsx
  update_signin_tsx
  echo
  
  # Update signup.tsx
  update_signup_tsx
  echo
  
  # Update _app.tsx
  update_app_tsx
  echo
  
  # Done
  echo -e "${GREEN}Terminal UI integration has been completed successfully!${RESET}"
  echo -e "${BLUE}Backups of your original files are available in: ${BACKUP_DIR}${RESET}"
  
  # Recommend next steps
  echo
  echo -e "${CYAN}Next Steps:${RESET}"
  echo -e "  ${MAGENTA}1. Restart your development server${RESET}"
  echo -e "  ${MAGENTA}2. Visit your signin and signup pages to see the changes${RESET}"
  echo -e "  ${MAGENTA}3. Try switching between light and dark modes with the theme toggle button${RESET}"
}

# Run main function
main