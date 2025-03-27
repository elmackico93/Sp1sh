import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import TerminalLogin from '@/components/auth/TerminalLogin';
import MatrixBackground from '@/components/auth/MatrixBackground';
import KeyboardShortcuts from '@/components/auth/KeyboardShortcuts';

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
    <>
      <Head>
        <title>Sign In | Sp1sh</title>
        <meta name="description" content="Access your Sp1sh shell script repository account" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
        {/* Matrix-style background */}
        <MatrixBackground />
        
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
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white px-4 py-2 rounded shadow-lg text-sm font-mono"
              >
                {authError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Show keyboard shortcuts only when not in boot sequence and not loading */}
        {!bootSequence && !isLoading && <KeyboardShortcuts />}
      </div>
    </>
  );
}