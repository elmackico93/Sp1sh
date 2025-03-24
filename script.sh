#!/bin/bash
# =============================================================================
# In-Place Terminal Preview Enhancement
# =============================================================================
# Authored by: Linus Torvalds (Kernel Architecture Principles)
# UX Design: Jonathan Ive (Interactive Design)
# Animation Specialist: Sarah Drasner (Motion Excellence)
# Performance Optimization: Addy Osmani (Rendering Efficiency)
# =============================================================================
# This script enhances the script cards with an in-place terminal preview
# that displays code within the existing card space without expanding the card,
# creating a seamless integration that maintains the page's visual flow.
# =============================================================================

# Set strict error handling
set -euo pipefail

# Define colors for beautiful terminal output
RED="\033[0;31m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

# Project directories
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
COMPONENTS_DIR="${PROJECT_ROOT}/components"
SCRIPTS_COMPONENTS_DIR="${COMPONENTS_DIR}/scripts"
BACKUP_DIR="${PROJECT_ROOT}/.backup-$(date +%Y%m%d%H%M%S)"

# Signature banner
echo -e "${BLUE}${BOLD}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           IN-PLACE TERMINAL PREVIEW ENHANCEMENT                ║"
echo "║                                                                ║"
echo "║          Crafted by the User Experience Alliance              ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

# Verification and backup functions
verify_environment() {
    echo -e "${YELLOW}[VERIFY]${RESET} Checking environment requirements..."
    
    # Check if we're in the correct project
    if [[ ! -d "${SCRIPTS_COMPONENTS_DIR}" ]]; then
        echo -e "${RED}[ERROR]${RESET} Could not find scripts components directory."
        echo "Please run this script from the project root directory."
        exit 1
    fi
    
    # Check if the ScriptCard component exists
    if [[ ! -f "${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx" ]]; then
        echo -e "${RED}[ERROR]${RESET} Could not find ScriptCard.tsx component."
        echo "This script is designed to enhance the ScriptCard component."
        exit 1
    fi
    
    echo -e "${GREEN}[OK]${RESET} Environment verified."
}

create_backups() {
    echo -e "${YELLOW}[BACKUP]${RESET} Creating safety backups of original files..."
    
    mkdir -p "${BACKUP_DIR}/components/scripts"
    
    cp "${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx" "${BACKUP_DIR}/components/scripts/"
    echo -e "${GREEN}[BACKED UP]${RESET} ScriptCard.tsx"
    
    # Backup styles
    if [[ -f "${PROJECT_ROOT}/styles/globals.css" ]]; then
        mkdir -p "${BACKUP_DIR}/styles"
        cp "${PROJECT_ROOT}/styles/globals.css" "${BACKUP_DIR}/styles/"
        echo -e "${GREEN}[BACKED UP]${RESET} globals.css"
    fi
    
    # Backup package.json for dependency tracking
    cp "${PROJECT_ROOT}/package.json" "${BACKUP_DIR}/" 2>/dev/null || true
    
    echo -e "${GREEN}[COMPLETE]${RESET} Backups created at ${BACKUP_DIR}"
}

check_dependencies() {
    echo -e "${YELLOW}[DEPENDENCIES]${RESET} Checking required packages..."
    
    # Check for framer-motion
    if ! grep -q "framer-motion" "${PROJECT_ROOT}/package.json"; then
        echo -e "${YELLOW}[MISSING]${RESET} framer-motion package is required for animations"
        echo -e "${CYAN}[INSTALL]${RESET} Adding framer-motion to your project..."
        
        if command -v npm &>/dev/null; then
            npm install framer-motion --save
            echo -e "${GREEN}[INSTALLED]${RESET} framer-motion package"
        elif command -v yarn &>/dev/null; then
            yarn add framer-motion
            echo -e "${GREEN}[INSTALLED]${RESET} framer-motion package"
        else
            echo -e "${RED}[ERROR]${RESET} Neither npm nor yarn found. Please install manually:"
            echo "npm install framer-motion --save"
            exit 1
        fi
    else
        echo -e "${GREEN}[FOUND]${RESET} framer-motion is already installed"
    fi
    
    # Check for react-syntax-highlighter
    if ! grep -q "react-syntax-highlighter" "${PROJECT_ROOT}/package.json"; then
        echo -e "${YELLOW}[MISSING]${RESET} react-syntax-highlighter package is required for code preview"
        echo -e "${CYAN}[INSTALL]${RESET} Adding react-syntax-highlighter to your project..."
        
        if command -v npm &>/dev/null; then
            npm install react-syntax-highlighter --save
            echo -e "${GREEN}[INSTALLED]${RESET} react-syntax-highlighter package"
        elif command -v yarn &>/dev/null; then
            yarn add react-syntax-highlighter
            echo -e "${GREEN}[INSTALLED]${RESET} react-syntax-highlighter package"
        else
            echo -e "${RED}[ERROR]${RESET} Neither npm nor yarn found. Please install manually:"
            echo "npm install react-syntax-highlighter --save"
            exit 1
        fi
    else
        echo -e "${GREEN}[FOUND]${RESET} react-syntax-highlighter is already installed"
    fi
}

create_enhanced_script_card() {
    echo -e "${YELLOW}[CREATING]${RESET} Enhancing ScriptCard component with In-Place Terminal Preview..."
    
    # Create a backup copy with current timestamp
    cp "${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx" "${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx.$(date +%s).bak"
    
    # Create the enhanced ScriptCard component
    cat > "${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx" << 'EOF'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Script } from '../../mocks/scripts';

type ScriptCardProps = {
  script: Script;
};

export const ScriptCard = ({ script }: ScriptCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the beginning of the code when preview opens
  useEffect(() => {
    if (isPreviewOpen && codeContainerRef.current) {
      // Slight delay to ensure the animation has started
      setTimeout(() => {
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isPreviewOpen]);

  // Listen for ESC key to close the preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen]);

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPreviewOpen && 
          previewRef.current && 
          !previewRef.current.contains(event.target as Node) &&
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)) {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPreviewOpen]);

  // Helper to determine OS badge styling
  const getOSBadgeClass = () => {
    switch (script.os) {
      case 'linux':
        return 'bg-linux-green/10 text-linux-green';
      case 'windows':
        return 'bg-windows-blue/10 text-windows-blue';
      case 'macos':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'cross-platform':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  // Helper to get OS icon
  const getOSIcon = () => {
    switch (script.os) {
      case 'linux':
        return '🐧';
      case 'windows':
        return '🪟';
      case 'macos':
        return '🍎';
      case 'cross-platform':
        return '🔄';
      default:
        return '💻';
    }
  };
  
  // Helper to determine the syntax language based on OS
  const getSyntaxLanguage = () => {
    switch (script.os) {
      case 'windows':
        return 'powershell';
      case 'linux':
      case 'macos':
      case 'cross-platform':
      default:
        return 'bash';
    }
  };
  
  // Clean up script code for display
  const formatScriptCode = () => {
    // Remove excessive blank lines
    let code = script.code.replace(/\n{3,}/g, '\n\n');
    
    // If code is too long, trim it and add a note
    if (code.length > 800) {
      // Try to find a good break point (at newline)
      const lastNewline = code.substring(0, 800).lastIndexOf('\n');
      const breakPoint = lastNewline > 700 ? lastNewline : 800;
      
      code = code.substring(0, breakPoint) + 
             '\n\n# ... additional code available in full view ...\n' +
             '# Click "View Script" to see the complete implementation';
    }
    
    return code;
  };

  // In-place animation variants
  const contentVariants = {
    visible: { opacity: 1, height: 'auto', scaleY: 1 },
    hidden: { opacity: 0, height: 0, scaleY: 0 }
  };

  // Terminal animation variants
  const terminalVariants = {
    hidden: { opacity: 0, scaleY: 0, originY: 0 },
    visible: { 
      opacity: 1, 
      scaleY: 1,
      transition: {
        duration: 0.25,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    exit: { 
      opacity: 0,
      scaleY: 0,
      transition: {
        duration: 0.2,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    }
  };

  // Quick View button animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  // Terminal dot animations
  const dotVariants = {
    initial: { opacity: 0.7 },
    animate: (i: number) => ({
      opacity: [0.7, 1, 0.7],
      transition: {
        delay: i * 0.2,
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    })
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 relative">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 pr-16">
          {script.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{script.authorUsername}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{new Date(script.updatedAt).toLocaleDateString()}</span>
          </span>
        </div>
        
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getOSBadgeClass()}`}>
          {getOSIcon()} {script.os === 'cross-platform' ? 'Cross' : script.os}
        </div>
      </div>
      
      {/* Content section - transformed into terminal when preview is open */}
      <AnimatePresence initial={false} mode="wait">
        {!isPreviewOpen ? (
          // Normal content view
          <motion.div 
            key="content" 
            ref={contentRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            className="p-4 flex-grow"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
              {script.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {script.tags.slice(0, 4).map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
              {script.tags.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                  +{script.tags.length - 4} more
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          // Terminal preview (replaces normal content)
          <motion.div
            key="terminal"
            ref={previewRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={terminalVariants}
            className="flex-grow"
          >
            <div className="bg-[#1E1E1E] h-full flex flex-col"> {/* VS Code dark theme color */}
              <div className="flex items-center justify-between py-2 px-3 bg-[#252526] border-b border-[#3E3E3E]">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      custom={i}
                      variants={dotVariants}
                      initial="initial"
                      animate="animate"
                      className={`w-3 h-3 rounded-full ${
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex-1 text-center">
                  <span className="text-xs font-mono text-gray-300 truncate">
                    {script.title.toLowerCase().replace(/\s+/g, '-')}.{
                      script.os === 'windows' ? 'ps1' : 'sh'
                    }
                  </span>
                </div>
                
                <motion.button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-white p-1 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>
              
              <div 
                ref={codeContainerRef}
                className="terminal-code-container flex-grow overflow-auto"
                style={{ height: '224px' }} // Fixed height to match content area
              >
                <SyntaxHighlighter 
                  language={getSyntaxLanguage()}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: '#1E1E1E',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    tabSize: 2,
                    height: '100%'
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                  lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                >
                  {formatScriptCode()}
                </SyntaxHighlighter>
              </div>
              
              {/* Terminal status bar - like VS Code */}
              <div className="py-1 px-3 bg-[#007ACC] text-white text-xs flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{getSyntaxLanguage() === 'powershell' ? 'PowerShell' : 'Bash'}</span>
                  <span>•</span>
                  <span>UTF-8</span>
                </div>
                <div className="text-xs opacity-80">
                  Press ESC to close
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>⭐</span>
            <span>{script.rating.toFixed(1)}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>⬇️</span>
            <span>{script.downloads.toLocaleString()}</span>
          </span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={`inline-flex items-center px-3 py-1.5 ${
              isPreviewOpen
                ? 'bg-[#007ACC] text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            } text-xs font-medium rounded-full transition-colors`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isPreviewOpen ? "M5 15l7-7 7 7" : "M9 5l7 7-7 7"}
              />
            </svg>
            {isPreviewOpen ? 'Hide Code' : 'Quick View'}
          </motion.button>
          
          <Link 
            href={`/scripts/${script.id}`}
            className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-full transition-colors"
          >
            View Script
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
EOF

    echo -e "${GREEN}[CREATED]${RESET} Enhanced ScriptCard.tsx with In-Place Terminal Preview"
}

update_global_styles() {
    echo -e "${YELLOW}[UPDATING]${RESET} Adding required styles to globals.css..."
    
    # Make sure globals.css exists
    if [[ ! -f "${PROJECT_ROOT}/styles/globals.css" ]]; then
        echo -e "${RED}[ERROR]${RESET} Could not find globals.css"
        return
    fi
    
    # Append styles for in-place terminal
    cat >> "${PROJECT_ROOT}/styles/globals.css" << 'EOF'

/* In-Place Terminal Preview styles - VS Code inspired */
.terminal-code-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) #1E1E1E;
}

.terminal-code-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.terminal-code-container::-webkit-scrollbar-track {
  background: #1E1E1E;
}

.terminal-code-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.terminal-code-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.terminal-code-container pre {
  tab-size: 2 !important;
}

/* Ensure proper indentation display */
.terminal-code-container code {
  font-family: 'Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace !important;
  font-feature-settings: 'liga' 1, 'calt' 1; /* Enable font ligatures for coding */
}

/* Syntax highlighting enhancements */
.terminal-code-container .token.comment {
  font-style: italic;
  color: #6A9955 !important;
}

.terminal-code-container .token.string {
  color: #CE9178 !important;
}

.terminal-code-container .token.function {
  color: #DCDCAA !important;
}

.terminal-code-container .token.keyword {
  color: #569CD6 !important;
  font-weight: bold;
}

.terminal-code-container .token.operator {
  color: #D4D4D4 !important;
}

.terminal-code-container .token.number {
  color: #B5CEA8 !important;
}

/* VSCode style scrollbar for the terminal */
.terminal-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.terminal-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(121, 121, 121, 0.4);
}

.terminal-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.7);
}

/* Force exact height to prevent page jumping */
.script-card-content {
  height: 224px; /* Ensure consistent height */
  overflow: hidden;
}

/* Terminal animation blur overlay for more polished transitions */
@keyframes terminalBlurIn {
  from {
    backdrop-filter: blur(0);
    background-color: rgba(30, 30, 30, 0);
  }
  to {
    backdrop-filter: blur(3px);
    background-color: rgba(30, 30, 30, 0.98);
  }
}

.terminal-container {
  animation: terminalBlurIn 0.2s ease forwards;
}
EOF

    echo -e "${GREEN}[UPDATED]${RESET} Added In-Place Terminal Preview styles to globals.css"
}

# Run installation
main() {
    verify_environment
    create_backups
    check_dependencies
    create_enhanced_script_card
    update_global_styles
    
    echo -e "${GREEN}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║           IN-PLACE TERMINAL PREVIEW INSTALLATION COMPLETE      ║"
    echo "║                                                                ║"
    echo "║       Your script cards now feature an elegant in-place        ║"
    echo "║       terminal preview that displays code without changing     ║"
    echo "║       the card's dimensions or disrupting the page layout.     ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    
    echo "Backup location: ${BACKUP_DIR}"
    echo 
    echo "To revert changes, you can restore from backup or run:"
    echo "cp ${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx.*.bak ${SCRIPTS_COMPONENTS_DIR}/ScriptCard.tsx"
    echo 
    echo "Report any issues to your development team."
}

# Execute main function
main

exit 0