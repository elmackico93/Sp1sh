#!/bin/bash
# =============================================================================
# Sp1sh Terminal Animation Integration Script
# =============================================================================
# Author: System Administrator
# Version: 1.0.0
# Created: March 2025
# 
# This script enhances the Sp1sh download modal by adding a realistic terminal
# animation that simulates a Linux-like download process. The animation shows
# command execution, progress bars, and verification steps before triggering
# the actual download.
# =============================================================================

# Text formatting colors
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
BOLD="\033[1m"
RESET="\033[0m"

# Define paths
PROJECT_ROOT="$(pwd)"
COMPONENTS_DIR="${PROJECT_ROOT}/components"
SCRIPTS_COMPONENTS_DIR="${COMPONENTS_DIR}/scripts"
STYLES_DIR="${PROJECT_ROOT}/styles"
BACKUP_DIR="${PROJECT_ROOT}/.backup_$(date +%Y%m%d_%H%M%S)"

# Check if we're in the correct directory
if [ ! -d "$COMPONENTS_DIR" ] || [ ! -d "$STYLES_DIR" ]; then
    echo -e "${RED}Error: This script must be run from the project root directory.${RESET}"
    echo "Please navigate to the directory containing the 'components' and 'styles' folders."
    exit 1
fi

# Display banner
show_banner() {
    echo -e "${BLUE}${BOLD}"
    echo "╔═════════════════════════════════════════════════════════════╗"
    echo "║                                                             ║"
    echo "║         Terminal Animation Download Modal Integration       ║"
    echo "║                                                             ║"
    echo "╚═════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo "This script will enhance the Sp1sh download modal with a terminal animation"
    echo "that simulates a Linux-like download process."
    echo
    echo -e "${YELLOW}Project: ${RESET}${PROJECT_ROOT}"
    echo
}

# Create backups
create_backups() {
    echo -e "${YELLOW}Creating backups before making changes...${RESET}"
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" ]; then
        cp "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" "${BACKUP_DIR}/DownloadModal.tsx.bak"
        echo -e "${GREEN}✓ Backed up DownloadModal.tsx${RESET}"
    else
        echo -e "${RED}Error: DownloadModal.tsx not found. Please ensure the download modal component exists.${RESET}"
        exit 1
    fi
    
    cp "${STYLES_DIR}/globals.css" "${BACKUP_DIR}/globals.css.bak"
    echo -e "${GREEN}✓ Backed up globals.css${RESET}"
    
    echo
}

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${RESET}"
    
    # Check if package.json exists
    if [ ! -f "${PROJECT_ROOT}/package.json" ]; then
        echo -e "${RED}Error: package.json not found. Are you in the project root?${RESET}"
        exit 1
    fi
    
    # Check for framer-motion dependency
    if ! grep -q '"framer-motion"' "${PROJECT_ROOT}/package.json"; then
        echo -e "${YELLOW}Warning: framer-motion not found in package.json${RESET}"
        echo -e "${BLUE}The animation requires framer-motion for smooth animations.${RESET}"
        
        read -p "Would you like to install framer-motion? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Installing framer-motion...${RESET}"
            npm install framer-motion --save
            echo -e "${GREEN}✓ framer-motion installed${RESET}"
        else
            echo -e "${YELLOW}Continuing without installing framer-motion. The animation may not work correctly.${RESET}"
        fi
    else
        echo -e "${GREEN}✓ framer-motion is already installed${RESET}"
    fi
    
    echo
}

# Create TerminalAnimation component
create_terminal_animation() {
    echo -e "${YELLOW}Creating TerminalAnimation component...${RESET}"
    
    # Create the component file
    cat > "${SCRIPTS_COMPONENTS_DIR}/TerminalAnimation.tsx" << 'EOF'
import React, { useState, useEffect, useRef } from 'react';
import { Script } from '../../mocks/scripts';

interface TerminalAnimationProps {
  script: Script;
  onComplete: () => void;
}

export const TerminalAnimation: React.FC<TerminalAnimationProps> = ({ script, onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Animation sequence
  useEffect(() => {
    const filename = `${script.title.toLowerCase().replace(/\s+/g, '-')}.${script.os === 'windows' ? 'ps1' : 'sh'}`;
    const commandSequence = [
      { text: `user@sp1sh:~$ sudo sp1sh-get download ${filename}`, delay: 50 },
      { text: `[sudo] password for user: `, delay: 500 },
      { text: `******`, delay: 400 },
      { text: `Searching for ${filename}...`, delay: 1000 },
      { text: `Found ${filename} in repository: sp1sh-main`, delay: 800 },
      { text: `Repository: https://repo.sp1sh.io/${script.category}`, delay: 600 },
      { text: `Author: ${script.authorUsername}`, delay: 400 },
      { text: `Version: ${new Date(script.updatedAt).toLocaleDateString()}`, delay: 400 },
      { text: `Rating: ${script.rating.toFixed(1)}/5.0 (${script.downloads} downloads)`, delay: 400 },
      { text: `Starting download...`, delay: 800 },
      { text: `Connecting to sp1sh servers...`, delay: 1200 },
      { text: `Downloading [                    ] 0%`, delay: 200 },
      { text: `Downloading [==                  ] 10%`, delay: 200 },
      { text: `Downloading [====                ] 20%`, delay: 200 },
      { text: `Downloading [======              ] 30%`, delay: 200 },
      { text: `Downloading [========            ] 40%`, delay: 200 },
      { text: `Downloading [==========          ] 50%`, delay: 200 },
      { text: `Downloading [============        ] 60%`, delay: 200 },
      { text: `Downloading [==============      ] 70%`, delay: 200 },
      { text: `Downloading [================    ] 80%`, delay: 200 },
      { text: `Downloading [==================  ] 90%`, delay: 200 },
      { text: `Downloading [====================] 100%`, delay: 300 },
      { text: `Verifying integrity of ${filename}...`, delay: 800 },
      { text: `Checksum verification: OK`, delay: 400 },
      { text: `Granting execution permissions: chmod +x ${filename}`, delay: 600 },
      { text: `Download complete! ${filename} ready to use.`, delay: 400 },
      { text: `user@sp1sh:~$ _`, delay: 300 },
    ];

    let currentLines: string[] = [];
    let currentIndex = 0;

    const typeNextLine = () => {
      if (currentIndex < commandSequence.length) {
        const { text, delay } = commandSequence[currentIndex];
        currentLines = [...currentLines, text];
        setLines([...currentLines]);
        
        // Scroll to bottom when new line is added
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }

        currentIndex++;
        setTimeout(typeNextLine, delay);
      } else {
        setIsComplete(true);
        // Wait a moment before triggering the download
        setTimeout(onComplete, 800);
      }
    };

    // Start the animation
    typeNextLine();

    // Cleanup
    return () => {
      currentLines = [];
      currentIndex = 0;
    };
  }, [script, onComplete]);

  return (
    <div 
      ref={terminalRef}
      className="bg-terminal-bg text-terminal-text rounded-lg h-64 overflow-auto p-4 font-mono text-sm border border-gray-700"
    >
      {lines.map((line, index) => (
        <div key={index} className="terminal-line">
          {line}
        </div>
      ))}
      {isComplete && <div className="text-green-400 mt-2">Download ready - File saved to your computer</div>}
    </div>
  );
};

export default TerminalAnimation;
EOF

    echo -e "${GREEN}✓ Created TerminalAnimation.tsx${RESET}"
    echo
}

# Update DownloadModal component
update_download_modal() {
    echo -e "${YELLOW}Updating DownloadModal component to use the terminal animation...${RESET}"
    
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" ]; then
        echo -e "${RED}Error: DownloadModal.tsx not found.${RESET}"
        exit 1
    }
    
    # Create the updated file
    cat > "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Script } from '../../mocks/scripts';
import { TerminalAnimation } from './TerminalAnimation';

interface DownloadModalProps {
  script: Script;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  script,
  isOpen,
  onClose,
  onDownload,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Reset animation state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAnimation(false);
    }
  }, [isOpen]);

  // Close modal when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleStartAnimation = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    onDownload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="terminal-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex gap-1.5 mr-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Download Script
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {script.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    You're downloading this script for {script.os === 'cross-platform' ? 'Cross-Platform' : script.os} systems.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">Size: 4.2KB</span>
                    <span className="mr-2">•</span>
                    <span>Version: {script.updatedAt ? new Date(script.updatedAt).toLocaleDateString() : 'Latest'}</span>
                  </div>
                </div>
                
                {/* Terminal Animation or Placeholder */}
                {showAnimation ? (
                  <TerminalAnimation script={script} onComplete={handleAnimationComplete} />
                ) : (
                  <div className="bg-terminal-bg rounded-lg h-64 flex items-center justify-center mb-6 border border-gray-700">
                    <div className="text-center">
                      <div className="text-5xl mb-3">💾</div>
                      <p className="text-terminal-text text-lg">Your script is ready to download</p>
                      <p className="text-gray-500 text-sm mt-2">Click below to start the download process</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  {!showAnimation && (
                    <button
                      onClick={handleStartAnimation}
                      className="flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Download {script.title.toLowerCase().replace(/\s+/g, '-')}.{script.os === 'windows' ? 'ps1' : 'sh'}
                    </button>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    By downloading, you agree to our <a href="/terms" className="text-primary hover:underline">terms of service</a> and <a href="/security" className="text-primary hover:underline">security guidelines</a>.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;
EOF

    echo -e "${GREEN}✓ Updated DownloadModal.tsx${RESET}"
    echo
}

# Add terminal animation styles
update_styles() {
    echo -e "${YELLOW}Adding terminal animation styles...${RESET}"
    
    # Check if we need to add terminal animation specific styles
    if ! grep -q "Terminal Animation Styles" "${STYLES_DIR}/globals.css"; then
        cat << 'EOF' >> "${STYLES_DIR}/globals.css"

/* Terminal Animation Styles */
.terminal-line {
  line-height: 1.5;
  white-space: pre-wrap;
  margin-bottom: 2px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: var(--terminal-text);
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
  vertical-align: middle;
}

/* Progress Bar Animation */
@keyframes progress-glow {
  0% { text-shadow: 0 0 2px rgba(74, 222, 128, 0.5); }
  50% { text-shadow: 0 0 8px rgba(74, 222, 128, 0.8); }
  100% { text-shadow: 0 0 2px rgba(74, 222, 128, 0.5); }
}

.terminal-line:nth-last-child(-n+16):nth-child(n+12) {
  animation: progress-glow 1.5s infinite;
  color: #4ade80;
}

/* Terminal theme colors */
.text-green-400 {
  color: #4ade80;
}

.text-terminal-green {
  color: var(--terminal-green);
}

/* Terminal scrollbar styling */
.bg-terminal-bg {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #1e1e1e;
}

.bg-terminal-bg::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-terminal-bg::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.bg-terminal-bg::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 4px;
}

.bg-terminal-bg::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
EOF
        echo -e "${GREEN}✓ Added terminal animation styles to globals.css${RESET}"
    else
        echo -e "${YELLOW}Terminal animation styles already exist in globals.css${RESET}"
    fi
    
    echo
}

# Run tests to verify the integration
run_tests() {
    echo -e "${YELLOW}Verifying changes...${RESET}"
    
    # Check that files exist
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/TerminalAnimation.tsx" ]; then
        echo -e "${RED}Error: TerminalAnimation.tsx was not created properly.${RESET}"
        echo -e "${YELLOW}Please check for errors above.${RESET}"
        return 1
    fi
    
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" ]; then
        echo -e "${RED}Error: DownloadModal.tsx is missing.${RESET}"
        echo -e "${YELLOW}Please check for errors above.${RESET}"
        return 1
    fi
    
    # Check that styles were added
    if ! grep -q "Terminal Animation Styles" "${STYLES_DIR}/globals.css"; then
        echo -e "${YELLOW}Warning: Terminal animation styles may not have been added correctly.${RESET}"
    fi
    
    echo -e "${GREEN}✓ All files created and modified successfully${RESET}"
    echo
    
    # Verify TypeScript syntax (if tsc is available)
    if command -v tsc &> /dev/null; then
        echo -e "${YELLOW}Checking TypeScript syntax...${RESET}"
        tsc --noEmit "${SCRIPTS_COMPONENTS_DIR}/TerminalAnimation.tsx" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ TypeScript syntax is valid${RESET}"
        else
            echo -e "${YELLOW}Warning: TypeScript syntax might have issues. Please review the files manually.${RESET}"
        fi
        echo
    fi
    
    return 0
}

# Summary of changes
show_summary() {
    echo -e "${BLUE}${BOLD}Integration Summary:${RESET}"
    echo -e "${GREEN}1. Created ${SCRIPTS_COMPONENTS_DIR}/TerminalAnimation.tsx${RESET}"
    echo -e "${GREEN}2. Updated ${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx${RESET}"
    echo -e "${GREEN}3. Added terminal animation styles to ${STYLES_DIR}/globals.css${RESET}"
    echo
    echo -e "${YELLOW}Next Steps:${RESET}"
    echo -e "1. Build and run the application: ${CYAN}npm run dev${RESET}"
    echo -e "2. Navigate to a script detail page and click the download button"
    echo -e "3. In the download modal, click the download button again to start the animation"
    echo -e "4. Verify that the terminal animation displays correctly"
    echo -e "5. Confirm that the download starts automatically after the animation completes"
    echo
    echo -e "${BLUE}If you need to revert the changes, restore from the backup directory:${RESET}"
    echo -e "${CYAN}${BACKUP_DIR}${RESET}"
    echo
}

# Main execution flow
main() {
    show_banner
    create_backups
    check_dependencies
    create_terminal_animation
    update_download_modal
    update_styles
    
    if run_tests; then
        show_summary
        echo -e "${GREEN}${BOLD}Terminal Animation Integration Complete!${RESET}"
        echo -e "${GREEN}The download modal now features an engaging Linux-style terminal animation.${RESET}"
    else
        echo -e "${RED}${BOLD}Integration failed. Please check the errors above.${RESET}"
        exit 1
    fi
}

# Execute the main function
main