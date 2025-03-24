#!/bin/bash
# =============================================================================
# Sp1sh Download Modal Enhancement Script
# =============================================================================
# Author: System Administrator
# Version: 1.0.0
# Created: March 2025
# 
# This script enhances the Sp1sh application by adding a beautiful download
# modal that appears when users click the download button on script detail pages.
# The modal is designed to match the site's existing style and is prepared to 
# potentially host a terminal in the future.
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
    echo "║           Sp1sh Download Modal Enhancement Script           ║"
    echo "║                                                             ║"
    echo "╚═════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo "This script will enhance the Sp1sh application with a beautiful"
    echo "download modal for script detail pages."
    echo
    echo -e "${YELLOW}Project: ${RESET}${PROJECT_ROOT}"
    echo
}

# Create backups
create_backups() {
    echo -e "${YELLOW}Creating backups before making changes...${RESET}"
    mkdir -p "$BACKUP_DIR"
    
    if [ -f "${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx" ]; then
        cp "${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx" "${BACKUP_DIR}/ScriptActions.tsx.bak"
        echo -e "${GREEN}✓ Backed up ScriptActions.tsx${RESET}"
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
        echo -e "${BLUE}The download modal requires framer-motion for animations.${RESET}"
        
        read -p "Would you like to install framer-motion? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Installing framer-motion...${RESET}"
            npm install framer-motion --save
            echo -e "${GREEN}✓ framer-motion installed${RESET}"
        else
            echo -e "${YELLOW}Continuing without installing framer-motion. The modal may not work correctly.${RESET}"
        fi
    else
        echo -e "${GREEN}✓ framer-motion is already installed${RESET}"
    fi
    
    echo
}

# Create the DownloadModal component
create_download_modal() {
    echo -e "${YELLOW}Creating DownloadModal component...${RESET}"
    
    # Create the component file
    cat > "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Script } from '../../mocks/scripts';

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
                
                {/* Terminal placeholder (for future implementation) */}
                <div className="bg-terminal-bg rounded-lg h-64 flex items-center justify-center mb-6 border border-gray-700">
                  <div className="text-center">
                    <div className="text-5xl mb-3">💾</div>
                    <p className="text-terminal-text text-lg">Your script is ready to download</p>
                    <p className="text-gray-500 text-sm mt-2">Terminal preview coming soon</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={onDownload}
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download {script.title.toLowerCase().replace(/\s+/g, '-')}.{script.os === 'windows' ? 'ps1' : 'sh'}
                  </button>
                  
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

    echo -e "${GREEN}✓ Created DownloadModal.tsx${RESET}"
    echo
}

# Update the ScriptActions component
update_script_actions() {
    echo -e "${YELLOW}Updating ScriptActions component...${RESET}"
    
    # Check if the file exists
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx" ]; then
        echo -e "${RED}Error: ScriptActions.tsx not found in ${SCRIPTS_COMPONENTS_DIR}${RESET}"
        exit 1
    fi
    
    # Create the updated file
    cat > "${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx" << 'EOF'
import React, { useState } from 'react';
import { Script } from '../../mocks/scripts';
import { DownloadModal } from './DownloadModal';

type ScriptActionsProps = {
  script: Script;
  onCopy?: () => void;
  showCopyFeedback?: boolean;
};

export const ScriptActions = ({ script, onCopy, showCopyFeedback = false }: ScriptActionsProps) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  const handleDownload = () => {
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}.${script.os === 'windows' ? 'ps1' : 'sh'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Close modal after download starts
    setIsDownloadModalOpen(false);
  };
  
  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else {
      try {
        await navigator.clipboard.writeText(script.code);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button 
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Script
        </button>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 py-2 px-4 ${
            showCopyFeedback 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          } rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative overflow-hidden`}
        >
          {showCopyFeedback ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy Script
            </>
          )}
          
          {/* Animation for copy feedback */}
          {showCopyFeedback && (
            <span className="absolute inset-0 bg-green-500 animate-pulse opacity-20"></span>
          )}
        </button>
        
        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share Script
        </button>
        
        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors md:ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          Save
        </button>
      </div>
      
      {/* Download Modal */}
      <DownloadModal
        script={script}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
      />
    </>
  );
};
EOF

    echo -e "${GREEN}✓ Updated ScriptActions.tsx${RESET}"
    echo
}

# Update the global styles
update_styles() {
    echo -e "${YELLOW}Updating global styles...${RESET}"
    
    # Check if the file exists
    if [ ! -f "${STYLES_DIR}/globals.css" ]; then
        echo -e "${RED}Error: globals.css not found in ${STYLES_DIR}${RESET}"
        exit 1
    fi
    
    # Add styles for the download modal
    cat >> "${STYLES_DIR}/globals.css" << 'EOF'

/* Download Modal Styles */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.modal-enter {
  animation: modalFadeIn 0.3s ease forwards;
}

.modal-exit {
  animation: modalFadeOut 0.2s ease forwards;
}

/* Modal backdrop blur effect */
.modal-backdrop {
  backdrop-filter: blur(5px);
  transition: backdrop-filter 0.3s ease;
}

/* Terminal in modal styling */
.download-terminal {
  background-color: var(--terminal-bg);
  color: var(--terminal-text);
  border-radius: 0.5rem;
  overflow: hidden;
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
}

/* Modal animation dot pulse effect */
@keyframes modalDotPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.modal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: modalDotPulse 2s infinite;
}

.modal-dot-red {
  background-color: #FF5F56;
  animation-delay: 0s;
}

.modal-dot-yellow {
  background-color: #FFBD2E;
  animation-delay: 0.3s;
}

.modal-dot-green {
  background-color: #27C93F;
  animation-delay: 0.6s;
}
EOF

    echo -e "${GREEN}✓ Added download modal styles to globals.css${RESET}"
    echo
}

# Run tests to verify the enhancement
run_tests() {
    echo -e "${YELLOW}Verifying changes...${RESET}"
    
    # Check that files exist
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx" ]; then
        echo -e "${RED}Error: DownloadModal.tsx was not created properly.${RESET}"
        echo -e "${YELLOW}Please check for errors above.${RESET}"
        return 1
    fi
    
    if [ ! -f "${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx" ]; then
        echo -e "${RED}Error: ScriptActions.tsx is missing.${RESET}"
        echo -e "${YELLOW}Please check for errors above.${RESET}"
        return 1
    fi
    
    echo -e "${GREEN}✓ All files created successfully${RESET}"
    echo
    
    # Verify framer-motion dependency
    if ! grep -q '"framer-motion"' "${PROJECT_ROOT}/package.json"; then
        echo -e "${YELLOW}Warning: framer-motion dependency might be missing.${RESET}"
        echo -e "${BLUE}The download modal requires framer-motion for animations.${RESET}"
        echo -e "${BLUE}Please run 'npm install framer-motion --save' if you haven't already.${RESET}"
    else
        echo -e "${GREEN}✓ framer-motion dependency is present${RESET}"
    fi
    
    echo
    return 0
}

# Summary of changes
show_summary() {
    echo -e "${BLUE}${BOLD}Enhancement Summary:${RESET}"
    echo -e "${GREEN}1. Created ${SCRIPTS_COMPONENTS_DIR}/DownloadModal.tsx${RESET}"
    echo -e "${GREEN}2. Updated ${SCRIPTS_COMPONENTS_DIR}/ScriptActions.tsx${RESET}"
    echo -e "${GREEN}3. Added download modal styles to ${STYLES_DIR}/globals.css${RESET}"
    echo
    echo -e "${YELLOW}Next Steps:${RESET}"
    echo -e "1. Build and run the application to verify the changes: ${CYAN}npm run dev${RESET}"
    echo -e "2. Navigate to a script detail page and test the download button"
    echo -e "3. Check that the modal opens with proper animations"
    echo -e "4. Verify that the download functionality works correctly"
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
    create_download_modal
    update_script_actions
    update_styles
    
    if run_tests; then
        show_summary
        echo -e "${GREEN}${BOLD}Enhancement completed successfully!${RESET}"
    else
        echo -e "${RED}${BOLD}Enhancement failed. Please check the errors above.${RESET}"
        exit 1
    fi
}

# Execute the main function
main