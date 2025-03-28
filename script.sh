#!/bin/bash

# Enhanced Search Results Integration Script for Sp1sh - Ubuntu LTS Optimized
# Integrates the new search results component into your production environment

# Color codes for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="search_integration_$(date +%Y%m%d_%H%M%S).log"

# Function for logging
log() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo -e "${message}" | tee -a "${LOG_FILE}"
}

# Function for displaying colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}" | tee -a "${LOG_FILE}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to handle errors
handle_error() {
    print_message "${RED}" "ERROR: $1"
    print_message "${YELLOW}" "Rolling back changes..."
    
    # Restore original files if backups exist
    if [ -d "./backups" ]; then
        for file in ./backups/*; do
            if [ -f "$file" ]; then
                local original_path=$(echo "$file" | sed 's|./backups/|./|')
                cp "$file" "$original_path"
                log "Restored: $original_path"
            elif [ -d "$file" ]; then
                local dir_name=$(basename "$file")
                if [ -d "./$dir_name" ]; then
                    cp -r "$file"/* "./$dir_name"/
                    log "Restored directory: $dir_name"
                fi
            fi
        done
    fi
    
    print_message "${RED}" "Integration failed. See ${LOG_FILE} for details."
    exit 1
}

# Check if we're in the project root directory
check_project_root() {
    if [ ! -f "package.json" ]; then
        handle_error "Please run this script from your project root directory"
    fi
    
    # Check if it's a Next.js or React project
    if ! grep -q "\"react\"" package.json && ! grep -q "\"next\"" package.json; then
        handle_error "This doesn't appear to be a React or Next.js project"
    fi
    
    # Check Ubuntu version
    if command_exists lsb_release; then
        local os_info=$(lsb_release -a 2>/dev/null | grep "Description" | cut -f2)
        log "Operating System: $os_info"
        if ! echo "$os_info" | grep -q "Ubuntu"; then
            print_message "${YELLOW}" "Warning: This script is optimized for Ubuntu LTS. You're running: $os_info"
        else
            print_message "${GREEN}" "Ubuntu detected: $os_info"
        fi
    else
        print_message "${YELLOW}" "Warning: Unable to determine OS. This script is optimized for Ubuntu LTS."
    fi
}

# Create backup of files that will be modified
create_backups() {
    print_message "${BLUE}" "Creating backups of files that will be modified..."
    
    mkdir -p backups
    
    # Back up components/search directory
    if [ -d "components/search" ]; then
        mkdir -p backups/components/search
        cp -r components/search/* backups/components/search/
        log "Backed up components/search directory"
    fi
    
    # Back up globals.css
    if [ -f "styles/globals.css" ]; then
        mkdir -p backups/styles
        cp styles/globals.css backups/styles/
        log "Backed up styles/globals.css"
    fi
    
    # Back up pages/search.tsx or similar if it exists
    if [ -f "pages/search.tsx" ]; then
        mkdir -p backups/pages
        cp pages/search.tsx backups/pages/
        log "Backed up pages/search.tsx"
    fi
    
    # Backup context file if it exists
    if [ -f "context/ScriptsContext.tsx" ]; then
        mkdir -p backups/context
        cp context/ScriptsContext.tsx backups/context/
        log "Backed up context/ScriptsContext.tsx"
    fi
    
    print_message "${GREEN}" "Backups created successfully"
}

# Install required dependencies
install_dependencies() {
    print_message "${BLUE}" "Installing required dependencies..."
    
    # Check if yarn or npm is being used
    if [ -f "yarn.lock" ]; then
        local package_manager="yarn"
    else
        local package_manager="npm"
    fi
    
    log "Using package manager: $package_manager"
    
    # Check if framer-motion is already installed
    if ! grep -q "\"framer-motion\"" package.json; then
        print_message "${CYAN}" "Installing framer-motion..."
        if [ "$package_manager" = "yarn" ]; then
            yarn add framer-motion || handle_error "Failed to install framer-motion"
        else
            npm install framer-motion --save || handle_error "Failed to install framer-motion"
        fi
        log "Installed framer-motion"
    else
        log "framer-motion is already installed"
    fi
    
    # Update react-icons if needed
    if grep -q "\"react-icons\"" package.json; then
        print_message "${CYAN}" "Updating react-icons..."
        if [ "$package_manager" = "yarn" ]; then
            yarn upgrade react-icons || print_message "${YELLOW}" "Warning: Unable to update react-icons"
        else
            npm update react-icons || print_message "${YELLOW}" "Warning: Unable to update react-icons"
        fi
        log "Updated react-icons"
    else
        print_message "${CYAN}" "Installing react-icons..."
        if [ "$package_manager" = "yarn" ]; then
            yarn add react-icons || handle_error "Failed to install react-icons"
        else
            npm install react-icons --save || handle_error "Failed to install react-icons"
        fi
        log "Installed react-icons"
    fi
    
    print_message "${GREEN}" "Dependencies installed/updated successfully"
}

# Add the EnhancedSearchResultsPage component
add_component() {
    print_message "${BLUE}" "Adding EnhancedSearchResultsPage component..."
    
    # Ensure the directory exists
    mkdir -p components/search
    
    # Check if the component file was uploaded
    if [ -f "EnhancedSearchResultsPage.tsx" ]; then
        cp EnhancedSearchResultsPage.tsx components/search/
        log "Copied EnhancedSearchResultsPage.tsx to components/search/"
    else
        handle_error "EnhancedSearchResultsPage.tsx file not found. Please upload it first."
    fi
    
    print_message "${GREEN}" "Component added successfully"
}

# Update route handling
update_routes() {
    print_message "${BLUE}" "Updating route handling..."
    
    # Check if we're using Next.js
    local is_nextjs=false
    if grep -q "\"next\"" package.json; then
        is_nextjs=true
    fi
    
    # For Next.js projects
    if [ "$is_nextjs" = true ]; then
        # Check if search page exists
        if [ -f "pages/search.tsx" ]; then
            # Create the updated search page content
            cat > pages/search.tsx <<EOL
import { EnhancedSearchResultsPage } from '../components/search/EnhancedSearchResultsPage';

export default function SearchPage() {
  return <EnhancedSearchResultsPage />;
}
EOL
            log "Updated pages/search.tsx"
        else
            # Create a new search page
            mkdir -p pages
            cat > pages/search.tsx <<EOL
import { EnhancedSearchResultsPage } from '../components/search/EnhancedSearchResultsPage';

export default function SearchPage() {
  return <EnhancedSearchResultsPage />;
}
EOL
            log "Created new pages/search.tsx"
        fi
        
        # Check if index page exists to add a reference to search results
        if [ -f "pages/index.tsx" ]; then
            if grep -q "searchTerm" pages/index.tsx && grep -q "SearchResults" pages/index.tsx; then
                print_message "${YELLOW}" "Detected SearchResults component in index.tsx"
                print_message "${YELLOW}" "Consider updating it to use EnhancedSearchResultsPage"
                log "Manual update may be required for pages/index.tsx"
            fi
        fi
    # For React projects
    else
        # Check for App.js or App.tsx
        if [ -f "src/App.js" ] || [ -f "src/App.tsx" ]; then
            local app_file=$([ -f "src/App.tsx" ] && echo "src/App.tsx" || echo "src/App.js")
            
            # Check if react-router is used
            if grep -q "react-router-dom" "$app_file"; then
                print_message "${YELLOW}" "Detected react-router in $app_file"
                print_message "${YELLOW}" "You need to manually update the route for the search page"
                log "Manual update required for router configuration in $app_file"
            else
                print_message "${YELLOW}" "No router detected. You may need to manually integrate the component"
                log "No router detected, manual integration may be required"
            fi
        fi
    fi
    
    print_message "${GREEN}" "Route handling updated"
}

# Update CSS
update_css() {
    print_message "${BLUE}" "Updating CSS styles..."
    
    # Find the appropriate CSS file
    local css_file=""
    if [ -f "styles/globals.css" ]; then
        css_file="styles/globals.css"
    elif [ -f "src/styles/globals.css" ]; then
        css_file="src/styles/globals.css"
    elif [ -f "src/index.css" ]; then
        css_file="src/index.css"
    else
        print_message "${YELLOW}" "Could not locate global CSS file. Creating new one."
        mkdir -p styles
        css_file="styles/globals.css"
        touch "$css_file"
    fi
    
    # Append the custom CSS
    cat >> "$css_file" <<EOL

/* Enhanced Search Results Page Custom Styles */
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Filter button effect */
.filter-button {
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
}

.filter-button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: currentColor;
  opacity: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  transition: all 0.4s ease;
}

.filter-button:active::after {
  opacity: 0.2;
  transform: translate(-50%, -50%) scale(20);
}

/* Verified script indicator */
.search-results-verified::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #4ade80, #0284c7, #7c3aed);
  opacity: 0;
  transform: scaleX(0.96);
  transform-origin: center;
  transition: opacity 0.3s ease, transform 0.4s ease;
  z-index: 1;
  border-radius: 2px;
}

.search-results-verified:hover::before {
  opacity: 1;
  transform: scaleX(1);
}

/* Performance optimizations */
.performance-card {
  will-change: transform, box-shadow;
}
EOL
    
    log "Updated $css_file with custom styles"
    print_message "${GREEN}" "CSS updated successfully"
}

# Check and update ScriptsContext if necessary
check_scripts_context() {
    print_message "${BLUE}" "Checking ScriptsContext..."
    
    if [ -f "context/ScriptsContext.tsx" ]; then
        # Check if context has the necessary properties
        local needs_update=false
        
        if ! grep -q "searchTerm" context/ScriptsContext.tsx; then
            needs_update=true
        fi
        
        if ! grep -q "setSearchTerm" context/ScriptsContext.tsx; then
            needs_update=true
        fi
        
        if ! grep -q "allScripts" context/ScriptsContext.tsx; then
            needs_update=true
        fi
        
        if [ "$needs_update" = true ]; then
            print_message "${YELLOW}" "ScriptsContext.tsx may need updates to include searchTerm, setSearchTerm, and allScripts"
            log "ScriptsContext.tsx needs manual review"
        else
            log "ScriptsContext.tsx appears to have the required properties"
        fi
    else
        print_message "${YELLOW}" "ScriptsContext.tsx not found. You may need to create or update it."
        log "ScriptsContext.tsx not found"
    fi
}

# Build for production
build_for_production() {
    print_message "${BLUE}" "Building for production..."
    
    # Check if it's a Next.js project
    if grep -q "\"next\"" package.json; then
        print_message "${CYAN}" "Running Next.js production build..."
        
        # Determine package manager
        if [ -f "yarn.lock" ]; then
            yarn build || print_message "${YELLOW}" "Next.js build failed - you may need to fix issues before deploying"
        else
            npm run build || print_message "${YELLOW}" "Next.js build failed - you may need to fix issues before deploying"
        fi
        
        if [ $? -eq 0 ]; then
            log "Next.js production build completed"
        else
            log "Next.js build encountered issues"
        fi
    else
        print_message "${CYAN}" "Running React production build..."
        
        # Determine package manager
        if [ -f "yarn.lock" ]; then
            yarn build || print_message "${YELLOW}" "React build failed - you may need to fix issues before deploying"
        else
            npm run build || print_message "${YELLOW}" "React build failed - you may need to fix issues before deploying"
        fi
        
        if [ $? -eq 0 ]; then
            log "React production build completed"
        else
            log "React build encountered issues"
        fi
    fi
}

# Main execution
main() {
    print_message "${BLUE}" "Starting Sp1sh Enhanced Search Results integration..."
    log "=== Integration Started at $(date) ==="
    
    # Run all steps
    check_project_root
    create_backups
    install_dependencies
    add_component
    update_routes
    update_css
    check_scripts_context
    build_for_production
    
    print_message "${GREEN}" "==================================="
    print_message "${GREEN}" "✅ Integration completed successfully!"
    print_message "${GREEN}" "==================================="
    
    print_message "${CYAN}" "Next steps:"
    print_message "${CYAN}" "1. Test the search functionality thoroughly"
    print_message "${CYAN}" "2. Review any warnings in the log file: ${LOG_FILE}"
    print_message "${CYAN}" "3. Consider implementing analytics for the new search page"
    
    log "=== Integration Completed at $(date) ==="
}

# Run the main function
main