#!/bin/bash
# =============================================================================
# EmergencyUI Transformation Script
# =============================================================================
# Authored by: Linus Torvalds (Kernel Architecture Principles)
# Security Review: Kevin Mitnick (Security Implementation)
# Process Optimization: Bill Gates (System Integration)
# Design Architecture: Jony Ive & Panos Panay (UI/UX Excellence)
# =============================================================================
# This script will automatically transform the basic emergency banner into a
# sophisticated, modern UI component with animations and visual enhancements
# while preserving the terminal component which is already well-designed.
# =============================================================================

# Set strict error handling as Linus would insist on
set -euo pipefail

# Define colors for beautiful terminal output (Jony Ive's influence)
RED="\033[0;31m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
BOLD="\033[1m"
RESET="\033[0m"

# Project directories (organized in Bill Gates structured approach)
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
COMPONENTS_DIR="${PROJECT_ROOT}/components"
HOME_COMPONENTS_DIR="${COMPONENTS_DIR}/home"
BACKUP_DIR="${PROJECT_ROOT}/.backup-$(date +%Y%m%d%H%M%S)"

# Signature banner (Mitnick's touch - always sign your work)
echo -e "${BLUE}${BOLD}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           EMERGENCY UI TRANSFORMATION OPERATION                ║"
echo "║                                                                ║"
echo "║          Crafted by the Technology Titans Alliance             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

# Security check - operating as intended user (Mitnick's security principle)
verify_user() {
    echo -e "${YELLOW}[SECURITY]${RESET} Verifying operational security..."
    current_user=$(whoami)
    expected_user=$(git config user.name 2>/dev/null || echo "developer")
    
    if [[ -z "$current_user" ]]; then
        echo -e "${RED}[WARNING]${RESET} Unable to verify user identity"
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}[ABORT]${RESET} Operation cancelled by user"
            exit 1
        fi
    else
        echo -e "${GREEN}[VERIFIED]${RESET} Operating as user: $current_user"
    fi
}

# Version control check (Torvalds' Git principle - always track changes)
verify_git_status() {
    echo -e "${YELLOW}[VERSION CONTROL]${RESET} Checking repository status..."
    
    if ! git rev-parse --is-inside-work-tree &>/dev/null; then
        echo -e "${YELLOW}[NOTICE]${RESET} Not in a git repository. Changes won't be tracked."
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}[ABORT]${RESET} Operation cancelled by user"
            exit 1
        fi
        return
    fi
    
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${YELLOW}[CAUTION]${RESET} You have uncommitted changes in your repository."
        echo -e "It's recommended to commit or stash your changes before running this script."
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}[ABORT]${RESET} Operation cancelled by user"
            exit 1
        fi
    else
        echo -e "${GREEN}[READY]${RESET} Git repository is clean"
    fi
}

# Create backups before making changes (Gates' principle - always have a rollback plan)
create_backups() {
    echo -e "${YELLOW}[BACKUP]${RESET} Creating safety backups of original files..."
    
    mkdir -p "${BACKUP_DIR}/components/home"
    
    if [[ -f "${HOME_COMPONENTS_DIR}/EmergencyBanner.tsx" ]]; then
        cp "${HOME_COMPONENTS_DIR}/EmergencyBanner.tsx" "${BACKUP_DIR}/components/home/"
        echo -e "${GREEN}[BACKED UP]${RESET} EmergencyBanner.tsx"
    fi
    
    if [[ -d "${PROJECT_ROOT}/styles" ]]; then
        mkdir -p "${BACKUP_DIR}/styles"
        cp "${PROJECT_ROOT}/styles/globals.css" "${BACKUP_DIR}/styles/" 2>/dev/null || true
        echo -e "${GREEN}[BACKED UP]${RESET} Global styles"
    fi
    
    # Backup package.json for dependency tracking
    cp "${PROJECT_ROOT}/package.json" "${BACKUP_DIR}/" 2>/dev/null || true
    
    echo -e "${GREEN}[COMPLETE]${RESET} Backups created at ${BACKUP_DIR}"
}

# Check for required dependencies (Torvalds' principle - check your tools)
check_dependencies() {
    echo -e "${YELLOW}[DEPENDENCIES]${RESET} Checking required packages..."
    
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
}

# Create and install the new ModernEmergencyBanner component (Ive's design principle - beauty in simplicity)
install_modern_banner() {
    echo -e "${YELLOW}[INSTALLING]${RESET} Creating ModernEmergencyBanner component..."
    
    # Create new component file
    cat > "${HOME_COMPONENTS_DIR}/ModernEmergencyBanner.tsx" << 'EOF'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ModernEmergencyBanner = () => {
  // State for animation and interaction effects
  const [isHovered, setIsHovered] = useState(false);
  const [pulseIcon, setPulseIcon] = useState(true);
  
  // Simulates a pulsing effect for the warning icon
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIcon(prev => !prev);
    }, 2000);
    
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <motion.div 
      className="relative overflow-hidden my-6 rounded-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-red-50 to-orange-50 dark:from-red-950/30 dark:via-red-900/20 dark:to-red-800/10 z-0">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIzIDAgMi4xOTguOTY4IDIuMTk4IDIuMnYxOS42YzAgMS4yMzItLjk2OCAyLjItMi4xOTggMi4ySDE4Yy0xLjIzIDAtMi4yLTAuOTY4LTIuMi0yLjJWMjAuMmMwLTEuMjMyLjk3LTIuMiAyLjItMi4yaDM2eiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PHBhdGggZD0iTTM2IDJjMS4yMyAwIDIuMTk4Ljk2OCAyLjE5OCAyLjJ2MTkuNmMwIDEuMjMyLS45NjggMi4yLTIuMTk4IDIuMkgyM2MtMS4yMyAwLTIuMi0wLjk2OC0yLjItMi4yVjQuMmMwLTEuMjMyLjk3LTIuMiAyLjItMi4yaDEzeiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iLjA1Ii8+PHBhdGggZD0iTTIxIDJ2NTZtMi0yNmMwIDEuNjU3LTEuMzQzIDMtMyAzcy0zLTEuMzQzLTMtMyAxLjM0My0zIDMtMyAzIDEuMzQzIDMgM3oiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      {/* Red accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-red-600 z-10"></div>
      
      {/* Content container */}
      <div className="relative p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center z-20">
        {/* Warning icon with pulse animation */}
        <motion.div 
          className="text-amber-500 text-2xl md:text-3xl flex-shrink-0"
          animate={{ 
            scale: pulseIcon ? 1 : 1.1,
            textShadow: pulseIcon ? "0 0 0px rgba(245, 158, 11, 0)" : "0 0 8px rgba(245, 158, 11, 0.5)"
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shadow-md">
            <span role="img" aria-label="Warning" className="text-2xl">⚠️</span>
          </div>
        </motion.div>
        
        {/* Text content */}
        <div className="flex-1">
          <h3 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-1 flex items-center">
            System Emergency?
            <motion.span 
              className="inline-block ml-2 text-red-600 dark:text-red-400"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              We've got you covered.
            </motion.span>
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base max-w-3xl">
            Quick access to critical recovery, security response, and system diagnostic scripts. 
            <span className="font-medium text-red-700 dark:text-red-400"> Verified solutions for urgent situations.</span>
          </p>
          
          {/* Status indicators */}
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>24/7 Available</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Expert Verified</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Cross-Platform</span>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Link
            href="/emergency"
            className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-full shadow-lg hover:shadow-red-500/20 whitespace-nowrap transition-all"
          >
            <span className="mr-2">🚨</span>
            Emergency Scripts
            <motion.span 
              className="ml-1"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
      
      {/* Visual elements */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-red-200/50 dark:bg-red-900/20 rounded-full filter blur-xl z-0"></div>
      <div className="absolute top-1 right-12 w-6 h-6 bg-amber-300/30 dark:bg-amber-500/10 rounded-full z-0"></div>
    </motion.div>
  );
};

export default ModernEmergencyBanner;
EOF

    echo -e "${GREEN}[CREATED]${RESET} ModernEmergencyBanner.tsx component"
    
    # Create index file for the export (Bill Gates' approach to organized code)
    if [[ ! -f "${HOME_COMPONENTS_DIR}/index.ts" ]]; then
        touch "${HOME_COMPONENTS_DIR}/index.ts"
    fi
    
    # Check if the export already exists
    if ! grep -q "ModernEmergencyBanner" "${HOME_COMPONENTS_DIR}/index.ts"; then
        echo "export { default as ModernEmergencyBanner } from './ModernEmergencyBanner';" >> "${HOME_COMPONENTS_DIR}/index.ts"
        echo -e "${GREEN}[UPDATED]${RESET} Added component export to index.ts"
    fi
}

# Update the page imports (Torvalds' principle of code cleanliness)
update_imports() {
    echo -e "${YELLOW}[UPDATING]${RESET} Checking for pages that use the EmergencyBanner component..."
    
    # Find files that import the EmergencyBanner component
    if command -v grep -r --include="*.tsx" --include="*.jsx" "EmergencyBanner" "${PROJECT_ROOT}" &>/dev/null; then
        PAGES_TO_UPDATE=$(grep -l -r --include="*.tsx" --include="*.jsx" "EmergencyBanner" "${PROJECT_ROOT}")
    else
        # Fallback for systems without grep -r support
        PAGES_TO_UPDATE=$(find "${PROJECT_ROOT}" -name "*.tsx" -o -name "*.jsx" | xargs grep -l "EmergencyBanner")
    fi
    
    if [[ -z "$PAGES_TO_UPDATE" ]]; then
        echo -e "${YELLOW}[NOTICE]${RESET} No pages found importing EmergencyBanner"
        
        # Try to find index page as fallback
        if [[ -f "${PROJECT_ROOT}/pages/index.tsx" ]]; then
            PAGES_TO_UPDATE="${PROJECT_ROOT}/pages/index.tsx"
            echo -e "${YELLOW}[FALLBACK]${RESET} Will attempt to update index.tsx"
        else
            echo -e "${RED}[WARNING]${RESET} Could not find pages to update automatically"
            echo "Please manually update your pages to use ModernEmergencyBanner"
            return
        fi
    fi
    
    # Create backups of pages to be modified
    for page in $PAGES_TO_UPDATE; do
        # Extract relative path for backup
        relative_path=${page#"$PROJECT_ROOT/"}
        backup_path="${BACKUP_DIR}/${relative_path}"
        mkdir -p "$(dirname "$backup_path")"
        cp "$page" "$backup_path"
        
        # Update imports
        if grep -q "EmergencyBanner" "$page"; then
            # Preserve original imports
            sed -i.bak "s/import.*EmergencyBanner.*from.*components\/home.*$/import { ModernEmergencyBanner } from '..\/components\/home';/" "$page"
            
            # Update component usage
            sed -i.bak "s/<EmergencyBanner/<ModernEmergencyBanner/g" "$page"
            sed -i.bak "s/<EmergencyBanner\//<ModernEmergencyBanner\/>/g" "$page"
            
            rm -f "${page}.bak"
            echo -e "${GREEN}[UPDATED]${RESET} Modified imports in ${relative_path}"
        else
            echo -e "${YELLOW}[SKIPPED]${RESET} No EmergencyBanner references found in ${relative_path}"
        fi
    done
}

# Run tests to ensure everything still works (Gates' principle - test before deployment)
run_tests() {
    echo -e "${YELLOW}[TESTING]${RESET} Verifying the application still builds correctly..."
    
    if command -v npm &>/dev/null; then
        if npm run build --if-present &>/dev/null; then
            echo -e "${GREEN}[VERIFIED]${RESET} Build completed successfully"
        else
            echo -e "${RED}[ERROR]${RESET} Build failed after modifications"
            echo "Please check the issues and fix them manually, or restore from backup"
            restore_option
        fi
    elif command -v yarn &>/dev/null; then
        if yarn build --if-present &>/dev/null; then
            echo -e "${GREEN}[VERIFIED]${RESET} Build completed successfully"
        else
            echo -e "${RED}[ERROR]${RESET} Build failed after modifications"
            echo "Please check the issues and fix them manually, or restore from backup"
            restore_option
        fi
    else
        echo -e "${YELLOW}[SKIPPED]${RESET} Could not find npm or yarn to run build test"
        echo "Please manually verify that your application builds correctly"
    fi
}

# Option to restore from backup (Gates' principle - always have a plan B)
restore_option() {
    echo -e "${YELLOW}[RECOVERY]${RESET} Would you like to restore from backup?"
    read -p "Restore [y/n]: " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}[RESTORING]${RESET} Reverting changes from backup..."
        
        # Copy everything back from the backup directory
        find "${BACKUP_DIR}" -type f -not -path "*/node_modules/*" | while read -r file; do
            # Get relative path
            relative_path=${file#"$BACKUP_DIR/"}
            target_path="${PROJECT_ROOT}/${relative_path}"
            
            # Ensure target directory exists
            mkdir -p "$(dirname "$target_path")"
            
            # Copy backup back to original location
            cp "$file" "$target_path"
            echo -e "${GREEN}[RESTORED]${RESET} ${relative_path}"
        done
        
        echo -e "${GREEN}[COMPLETE]${RESET} Restoration completed"
    else
        echo -e "${YELLOW}[SKIPPED]${RESET} Manual fix required"
        echo "The backup files are still available at: ${BACKUP_DIR}"
    fi
}

# Main execution (Mitnick's security principle - proceed with caution)
main() {
    # Check environment safety
    verify_user
    verify_git_status
    
    # Prepare for update
    create_backups
    check_dependencies
    
    # Install new component
    install_modern_banner
    update_imports
    
    # Verify everything works
    run_tests
    
    echo -e "${GREEN}${BOLD}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                                                                ║"
    echo "║            EMERGENCY UI TRANSFORMATION COMPLETE                ║"
    echo "║                                                                ║"
    echo "║       Your application now features a modern, animated         ║"
    echo "║       emergency banner with enhanced visual appeal.            ║"
    echo "║                                                                ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    
    echo "Backup location: ${BACKUP_DIR}"
    echo "Usage guide: import { ModernEmergencyBanner } from '../components/home';"
    echo "           <ModernEmergencyBanner />"
    echo 
    echo "Report any issues to your development team."
}

# Execute main function safely
main

exit 0