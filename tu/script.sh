#!/bin/bash

# ===================================================================
# Robust Terminal UI Installation Script for SP1SH
# ===================================================================
#
# This script installs the enhanced terminal theme components from
# the "tu" directory into your SP1SH codebase with comprehensive
# error handling, validation, and backup functionality.
#
# Usage: ./install-terminal-ui.sh [options]
#   Options:
#     --force              Skip confirmation prompts
#     --no-backup          Skip creating backups of existing files
#     --dry-run            Simulate installation without making changes
#     --verbose            Show detailed output
#     --help               Display this help message

# Exit on any error
set -e

# Enable error trapping
trap cleanup EXIT

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
COMPONENT_DIR="./components"
STYLES_DIR="./styles"
PAGES_DIR="./pages"
AUTH_COMPONENT_DIR="${COMPONENT_DIR}/auth"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="${SOURCE_DIR}/backups/${TIMESTAMP}"
LOG_FILE="${SOURCE_DIR}/logs/installation-${TIMESTAMP}.log"
CHECKSUM_FILE="${SOURCE_DIR}/checksums.md5"
ERROR_LOG="${SOURCE_DIR}/logs/errors-${TIMESTAMP}.log"
TEMP_DIR=$(mktemp -d)
VERSION="1.0.0"
SCRIPT_NAME=$(basename "$0")

# State variables
INSTALL_ERRORS=false
NEEDS_ROLLBACK=false
VERBOSE=false
STARTED_AT=$(date +%s)

# Initialize variables with default values
FORCE_INSTALL=false
CREATE_BACKUPS=true
DRY_RUN=false

# Function to log messages
log() {
  local level=$1
  local message=$2
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  
  # Ensure logs directory exists
  mkdir -p "$(dirname "$LOG_FILE")"
  
  # Write to log file
  echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
  
  # Output to console based on level and verbosity
  if [ "$VERBOSE" = true ] || [ "$level" != "DEBUG" ]; then
    case $level in
      "INFO")
        echo -e "${BLUE}[${timestamp}] ${level}: ${message}${RESET}"
        ;;
      "WARNING")
        echo -e "${YELLOW}[${timestamp}] ${level}: ${message}${RESET}"
        ;;
      "ERROR")
        echo -e "${RED}[${timestamp}] ${level}: ${message}${RESET}" | tee -a "$ERROR_LOG"
        ;;
      "SUCCESS")
        echo -e "${GREEN}[${timestamp}] ${level}: ${message}${RESET}"
        ;;
      "DEBUG")
        if [ "$VERBOSE" = true ]; then
          echo -e "${MAGENTA}[${timestamp}] ${level}: ${message}${RESET}"
        fi
        ;;
      *)
        echo -e "[${timestamp}] ${level}: ${message}"
        ;;
    esac
  fi
}

# Function to generate checksums for installed files
generate_checksums() {
  log "DEBUG" "Generating checksums for installed files"
  
  # Ensure tu directory exists
  if [ ! -d "$SOURCE_DIR" ]; then
    log "ERROR" "Source directory '$SOURCE_DIR' not found."
    return 1
  fi
  
  # Create checksums file
  if [ -f "$CHECKSUM_FILE" ]; then
    rm "$CHECKSUM_FILE"
  fi
  
  # Generate checksums for all files in the source directory
  find "$SOURCE_DIR" -type f -not -path "*/\.*" -not -path "*/backups/*" -not -path "*/logs/*" -exec md5sum {} \; | sed "s|$SOURCE_DIR/||" > "$CHECKSUM_FILE"
  
  log "DEBUG" "Checksums generated successfully"
}

# Function to verify checksums of installed files
verify_checksums() {
  log "DEBUG" "Verifying checksums of installed files"
  
  # Check if checksums file exists
  if [ ! -f "$CHECKSUM_FILE" ]; then
    log "WARNING" "Checksums file not found. Cannot verify integrity."
    return 1
  fi
  
  # Copy checksums file to temporary location
  cp "$CHECKSUM_FILE" "$TEMP_DIR/checksums.md5"
  
  # Verify checksums
  cd "$SOURCE_DIR" && md5sum -c "$TEMP_DIR/checksums.md5" > "$TEMP_DIR/checksum_results.txt" 2>&1
  
  # Check verification results
  if grep -q "FAILED" "$TEMP_DIR/checksum_results.txt"; then
    log "ERROR" "Checksum verification failed for one or more files:"
    grep "FAILED" "$TEMP_DIR/checksum_results.txt" | while read -r line; do
      log "ERROR" "  $line"
    done
    return 1
  else
    log "SUCCESS" "All checksums verified successfully"
    return 0
  fi
}

# Function to show help
show_help() {
  echo -e "${BOLD}${CYAN}SP1SH Terminal UI Installation Script v${VERSION}${RESET}"
  echo
  echo -e "Usage: ${SCRIPT_NAME} [options]"
  echo
  echo -e "Options:"
  echo -e "  --force              Skip confirmation prompts"
  echo -e "  --no-backup          Skip creating backups of existing files"
  echo -e "  --dry-run            Simulate installation without making changes"
  echo -e "  --verbose            Show detailed output"
  echo -e "  --help               Display this help message"
  echo
  echo -e "Description:"
  echo -e "  This script installs the enhanced terminal theme components"
  echo -e "  from the \"tu\" directory into your SP1SH codebase."
  echo
  echo -e "  Backups are stored in: ${SOURCE_DIR}/backups"
  echo -e "  Logs are stored in: ${SOURCE_DIR}/logs"
  echo
  echo -e "Examples:"
  echo -e "  ${SCRIPT_NAME} --verbose"
  echo -e "  ${SCRIPT_NAME} --force --no-backup"
  echo -e "  ${SCRIPT_NAME} --dry-run"
  echo
  echo -e "Report issues to: your-email@example.com"
}

# Function to handle cleanup
cleanup() {
  local exit_code=$?
  
  # Remove temporary files
  if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
    log "DEBUG" "Removed temporary directory: $TEMP_DIR"
  fi
  
  # Calculate execution time
  local ended_at=$(date +%s)
  local duration=$((ended_at - STARTED_AT))
  
  # Log completion status
  if [ $exit_code -eq 0 ]; then
    log "INFO" "Script completed successfully in ${duration} seconds"
    echo -e "\n${GREEN}Installation completed successfully in ${duration} seconds!${RESET}"
  else
    if [ "$NEEDS_ROLLBACK" = true ]; then
      log "ERROR" "Installation failed with exit code ${exit_code}. Rollback required."
      echo -e "\n${RED}Installation failed with exit code ${exit_code}. See logs for details.${RESET}"
    else
      log "ERROR" "Script exited with error code ${exit_code} in ${duration} seconds"
      echo -e "\n${RED}Script exited with error code ${exit_code}. See logs for details.${RESET}"
    fi
  fi
  
  # Display log location
  if [ -f "$LOG_FILE" ]; then
    echo -e "${BLUE}A detailed log has been saved to: ${LOG_FILE}${RESET}"
  fi
}

# Function to process command line arguments
process_arguments() {
  for arg in "$@"; do
    case $arg in
      --force)
        FORCE_INSTALL=true
        log "INFO" "Force install mode enabled"
        ;;
      --no-backup)
        CREATE_BACKUPS=false
        log "INFO" "Backup creation disabled"
        ;;
      --dry-run)
        DRY_RUN=true
        log "INFO" "Dry run mode enabled"
        ;;
      --verbose)
        VERBOSE=true
        log "INFO" "Verbose mode enabled"
        ;;
      --help)
        show_help
        exit 0
        ;;
      *)
        log "ERROR" "Unknown argument: $arg"
        echo -e "${RED}Unknown argument: $arg${RESET}"
        echo "Use --help to see available options"
        exit 1
        ;;
    esac
  done
}

# Function to confirm action
confirm() {
  if [ "$FORCE_INSTALL" = true ]; then
    return 0
  fi
  
  local prompt="$1"
  local default="${2:-n}"
  
  if [ "$default" = "y" ]; then
    prompt="${prompt} [Y/n]: "
  else
    prompt="${prompt} [y/N]: "
  fi
  
  read -p "$prompt" response
  
  if [ -z "$response" ]; then
    response="$default"
  fi
  
  case "$response" in
    [yY][eE][sS]|[yY]) 
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Function to validate source files
validate_source_files() {
  log "INFO" "Validating source files"
  
  # List of required files
  local required_files=(
    "terminal-theme.css"
    "terminal-theme-provider.tsx"
    "terminal-theme-switcher.tsx"
    "enhanced-matrix-background.tsx"
    "terminal-implementation.tsx"
  )
  
  # Check each required file
  local missing_files=()
  for file in "${required_files[@]}"; do
    if [ ! -f "${SOURCE_DIR}/${file}" ]; then
      log "ERROR" "Required file not found: ${file}"
      missing_files+=("${file}")
    fi
  done
  
  # If any files are missing, return error
  if [ ${#missing_files[@]} -gt 0 ]; then
    log "ERROR" "${#missing_files[@]} required files are missing"
    echo -e "${RED}The following required files are missing:${RESET}"
    for file in "${missing_files[@]}"; do
      echo -e "  ${RED}• ${file}${RESET}"
    done
    return 1
  fi
  
  # Verify file permissions
  local invalid_permissions=()
  for file in "${required_files[@]}"; do
    if [ ! -r "${SOURCE_DIR}/${file}" ]; then
      log "ERROR" "File is not readable: ${file}"
      invalid_permissions+=("${file}")
    fi
  done
  
  # If any files have invalid permissions, return error
  if [ ${#invalid_permissions[@]} -gt 0 ]; then
    log "ERROR" "${#invalid_permissions[@]} files have invalid permissions"
    echo -e "${RED}The following files have invalid permissions:${RESET}"
    for file in "${invalid_permissions[@]}"; do
      echo -e "  ${RED}• ${file}${RESET}"
    done
    return 1
  fi
  
  log "SUCCESS" "All source files validated successfully"
  return 0
}

# Function to validate target directories
validate_target_directories() {
  log "INFO" "Validating target directories"
  
  # List of required directories
  local required_dirs=(
    "$COMPONENT_DIR"
    "$STYLES_DIR"
    "$PAGES_DIR"
  )
  
  # Check each required directory
  local missing_dirs=()
  for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
      log "WARNING" "Target directory not found: ${dir}"
      missing_dirs+=("${dir}")
    fi
  done
  
  # If directories are missing but we're not in dry run mode, ask to create them
  if [ ${#missing_dirs[@]} -gt 0 ] && [ "$DRY_RUN" = false ]; then
    log "INFO" "Some target directories need to be created"
    if confirm "Create missing directories?" "y"; then
      for dir in "${missing_dirs[@]}"; do
        if [ "$DRY_RUN" = false ]; then
          mkdir -p "$dir"
          if [ $? -eq 0 ]; then
            log "SUCCESS" "Created directory: ${dir}"
          else
            log "ERROR" "Failed to create directory: ${dir}"
            return 1
          fi
        else
          log "DEBUG" "[DRY RUN] Would create directory: ${dir}"
        fi
      done
    else
      log "ERROR" "Cannot proceed without required directories"
      return 1
    fi
  fi
  
  # Check write permissions for directories
  local invalid_permissions=()
  for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ] && [ ! -w "$dir" ]; then
      log "ERROR" "Directory is not writable: ${dir}"
      invalid_permissions+=("${dir}")
    fi
  done
  
  # If any directories have invalid permissions, return error
  if [ ${#invalid_permissions[@]} -gt 0 ]; then
    log "ERROR" "${#invalid_permissions[@]} directories have invalid permissions"
    echo -e "${RED}The following directories are not writable:${RESET}"
    for dir in "${invalid_permissions[@]}"; do
      echo -e "  ${RED}• ${dir}${RESET}"
    done
    return 1
  fi
  
  # Check for auth component directory, create if it doesn't exist
  if [ ! -d "$AUTH_COMPONENT_DIR" ]; then
    log "WARNING" "Auth component directory not found: ${AUTH_COMPONENT_DIR}"
    if confirm "Create auth component directory?" "y"; then
      if [ "$DRY_RUN" = false ]; then
        mkdir -p "$AUTH_COMPONENT_DIR"
        if [ $? -eq 0 ]; then
          log "SUCCESS" "Created auth component directory: ${AUTH_COMPONENT_DIR}"
        else
          log "ERROR" "Failed to create auth component directory: ${AUTH_COMPONENT_DIR}"
          return 1
        fi
      else
        log "DEBUG" "[DRY RUN] Would create directory: ${AUTH_COMPONENT_DIR}"
      fi
    else
      log "ERROR" "Cannot proceed without auth component directory"
      return 1
    fi
  fi
  
  log "SUCCESS" "All target directories validated successfully"
  return 0
}

# Function to check for existing files
check_existing_files() {
  log "INFO" "Checking for existing files"
  
  # List of target files
  local target_files=(
    "${STYLES_DIR}/terminal-theme.css"
    "${AUTH_COMPONENT_DIR}/TerminalThemeProvider.tsx"
    "${AUTH_COMPONENT_DIR}/TerminalThemeSwitcher.tsx"
    "${AUTH_COMPONENT_DIR}/EnhancedMatrixBackground.tsx"
  )
  
  # Check each target file
  local existing_files=()
  for file in "${target_files[@]}"; do
    if [ -f "$file" ]; then
      log "WARNING" "File already exists: ${file}"
      existing_files+=("${file}")
    fi
  done
  
  # If any files exist, ask for confirmation
  if [ ${#existing_files[@]} -gt 0 ]; then
    log "WARNING" "${#existing_files[@]} files will be overwritten"
    echo -e "${YELLOW}The following files will be overwritten:${RESET}"
    for file in "${existing_files[@]}"; do
      echo -e "  ${YELLOW}• ${file}${RESET}"
    done
    echo
    
    if [ "$CREATE_BACKUPS" = true ]; then
      echo -e "${BLUE}Backups will be created in: ${BACKUP_DIR}${RESET}"
    else
      echo -e "${RED}Warning: No backups will be created.${RESET}"
    fi
    echo
    
    if ! confirm "Do you want to proceed and overwrite these files?"; then
      log "INFO" "Installation aborted by user"
      echo -e "${YELLOW}Installation aborted.${RESET}"
      exit 0
    fi
  fi
  
  log "SUCCESS" "Existing files check completed"
}

# Function to create backup
backup_file() {
  local src="$1"
  local filename=$(basename "$src")
  local dir=$(dirname "$src")
  local target_dir="${BACKUP_DIR}/${dir}"
  
  if [ "$CREATE_BACKUPS" = true ] && [ -f "$src" ]; then
    log "DEBUG" "Creating backup for: ${src}"
    
    if [ "$DRY_RUN" = false ]; then
      # Ensure backup directory exists
      mkdir -p "$target_dir"
      
      # Copy the file with preserved attributes
      cp -p "$src" "${target_dir}/${filename}"
      
      if [ $? -eq 0 ]; then
        log "SUCCESS" "Backed up: ${src} -> ${target_dir}/${filename}"
      else
        log "ERROR" "Failed to back up: ${src}"
        return 1
      fi
    else
      log "DEBUG" "[DRY RUN] Would back up: ${src} -> ${target_dir}/${filename}"
    fi
  fi
  
  return 0
}

# Function to ensure a directory exists
ensure_dir() {
  local dir="$1"
  
  if [ ! -d "$dir" ]; then
    log "DEBUG" "Creating directory: ${dir}"
    
    if [ "$DRY_RUN" = false ]; then
      mkdir -p "$dir"
      if [ $? -eq 0 ]; then
        log "SUCCESS" "Created directory: ${dir}"
      else
        log "ERROR" "Failed to create directory: ${dir}"
        return 1
      fi
    else
      log "DEBUG" "[DRY RUN] Would create directory: ${dir}"
    fi
  fi
  
  return 0
}

# Function to install a component
install_component() {
  local src="$1"
  local dest="$2"
  local component=$(basename "$src")
  
  log "INFO" "Installing component: ${component}"
  
  # Create destination directory if it doesn't exist
  ensure_dir "$(dirname "$dest")"
  
  # Backup existing file if it exists
  if [ -f "$dest" ]; then
    if ! backup_file "$dest"; then
      log "ERROR" "Backup failed for: ${dest}"
      return 1
    fi
  fi
  
  # Install the file
  if [ "$DRY_RUN" = false ]; then
    # Copy the file with preserved attributes
    cp -p "$src" "$dest"
    
    if [ $? -eq 0 ]; then
      log "SUCCESS" "Installed: ${component} -> ${dest}"
    else
      log "ERROR" "Failed to install: ${component}"
      INSTALL_ERRORS=true
      return 1
    fi
    
    # Set appropriate permissions
    chmod 644 "$dest"
  else
    log "DEBUG" "[DRY RUN] Would install: ${src} -> ${dest}"
  fi
  
  return 0
}

# Function to perform rollback in case of failure
rollback() {
  log "WARNING" "Rolling back installation due to errors"
  echo -e "${YELLOW}Installation encountered errors. Rolling back...${RESET}"
  
  if [ "$CREATE_BACKUPS" = false ] || [ ! -d "$BACKUP_DIR" ]; then
    log "ERROR" "Cannot rollback: No backups found"
    echo -e "${RED}Cannot rollback: No backups were created.${RESET}"
    return 1
  fi
  
  # Find all backed up files
  local backup_files=$(find "$BACKUP_DIR" -type f)
  
  if [ -z "$backup_files" ]; then
    log "ERROR" "No backup files found for rollback"
    echo -e "${RED}No backup files found for rollback.${RESET}"
    return 1
  fi
  
  local rollback_errors=false
  
  # Restore each backed up file
  echo "$backup_files" | while read -r backup_file; do
    # Get relative path from backup dir
    local rel_path="${backup_file#$BACKUP_DIR/}"
    local target_file="/$rel_path"
    
    log "INFO" "Restoring: ${backup_file} -> ${target_file}"
    
    # Restore the file
    cp -p "$backup_file" "$target_file"
    
    if [ $? -eq 0 ]; then
      log "SUCCESS" "Restored: ${target_file}"
    else
      log "ERROR" "Failed to restore: ${target_file}"
      rollback_errors=true
    fi
  done
  
  if [ "$rollback_errors" = true ]; then
    log "ERROR" "Rollback completed with errors"
    echo -e "${RED}Rollback completed with errors. See log for details.${RESET}"
    return 1
  else
    log "SUCCESS" "Rollback completed successfully"
    echo -e "${GREEN}Rollback completed successfully.${RESET}"
    return 0
  fi
}

# Function to create installation log
create_installation_log() {
  log "INFO" "Creating installation log"
  
  # Create a detailed log file with installation summary
  local instruction_log="${SOURCE_DIR}/INSTALLATION.md"
  
  cat > "$instruction_log" << EOL
# SP1SH Terminal UI Theme Installation

**Installation Date:** $(date "+%Y-%m-%d %H:%M:%S")

## Components Installed

The following components were installed in your SP1SH codebase:

- Terminal theme CSS: \`${STYLES_DIR}/terminal-theme.css\`
- Terminal theme provider: \`${AUTH_COMPONENT_DIR}/TerminalThemeProvider.tsx\`
- Terminal theme switcher: \`${AUTH_COMPONENT_DIR}/TerminalThemeSwitcher.tsx\`
- Enhanced matrix background: \`${AUTH_COMPONENT_DIR}/EnhancedMatrixBackground.tsx\`

## Next Steps

To complete the integration of the terminal UI theme, please follow these steps:

### 1. Import the terminal theme CSS

Add the following line to your \`globals.css\` file:

\`\`\`css
@import './terminal-theme.css';
\`\`\`

### 2. Update your sign-in and sign-up pages

The implementation example is available at \`${SOURCE_DIR}/terminal-implementation.tsx\`.

Key changes to make:

- Replace \`MatrixBackground\` with \`EnhancedMatrixBackground\`
- Wrap the page content with \`TerminalThemeProvider\`
- Add the \`TerminalThemeSwitcher\` component

### 3. Update your _app.tsx

Make sure your \`_app.tsx\` includes the ThemeProvider from next-themes:

\`\`\`tsx
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
\`\`\`

## Backup Information

${CREATE_BACKUPS ? "Backups of your original files were created in: \`${BACKUP_DIR}\`" : "No backups were created during installation."}

## Installation Log

Detailed logs of the installation process are available in: \`${LOG_FILE}\`

## Support

If you encounter any issues with the terminal UI theme, please contact your development team.
EOL

  log "SUCCESS" "Installation log created: ${instruction_log}"
}

# Main installation function
perform_installation() {
  log "INFO" "Starting installation process"
  
  # Create necessary directories for logs and backups
  ensure_dir "${SOURCE_DIR}/logs"
  if [ "$CREATE_BACKUPS" = true ]; then
    ensure_dir "$BACKUP_DIR"
  fi
  
  # Install components
  log "INFO" "Installing terminal theme components"
  
  # Install CSS
  install_component "${SOURCE_DIR}/terminal-theme.css" "${STYLES_DIR}/terminal-theme.css"
  
  # Install TypeScript components
  install_component "${SOURCE_DIR}/terminal-theme-provider.tsx" "${AUTH_COMPONENT_DIR}/TerminalThemeProvider.tsx"
  install_component "${SOURCE_DIR}/terminal-theme-switcher.tsx" "${AUTH_COMPONENT_DIR}/TerminalThemeSwitcher.tsx"
  install_component "${SOURCE_DIR}/enhanced-matrix-background.tsx" "${AUTH_COMPONENT_DIR}/EnhancedMatrixBackground.tsx"
  
  # Copy implementation example
  install_component "${SOURCE_DIR}/terminal-implementation.tsx" "${SOURCE_DIR}/terminal-implementation.tsx.example"
  
  if [ "$INSTALL_ERRORS" = true ]; then
    log "ERROR" "Installation completed with errors"
    NEEDS_ROLLBACK=true
    return 1
  else
    log "SUCCESS" "All components installed successfully"
    
    # Create installation log with instructions
    create_installation_log
    
    # Generate checksums for verification
    if [ "$DRY_RUN" = false ]; then
      generate_checksums
    fi
    
    return 0
  fi
}

# Main function
main() {
  # Process command line arguments
  process_arguments "$@"
  
  # Create logs directory
  mkdir -p "$(dirname "$LOG_FILE")"
  mkdir -p "$(dirname "$ERROR_LOG")"
  
  # Initialize log
  log "INFO" "Starting SP1SH Terminal UI installation script v${VERSION}"
  log "INFO" "Script running in $(pwd)"
  
  # Print banner
  echo -e "${BOLD}${CYAN}"
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                                                            ║"
  echo "║     SP1SH Terminal UI Theme Installation v${VERSION}         ║"
  echo "║                                                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  
  echo -e "${YELLOW}This script will install the enhanced terminal theme components for SP1SH.${RESET}"
  echo
  
  # Check if source directory exists
  if [ ! -d "$SOURCE_DIR" ]; then
    log "ERROR" "Source directory '$SOURCE_DIR' not found."
    echo -e "${RED}Error: Source directory '$SOURCE_DIR' not found.${RESET}"
    echo "Please ensure you've downloaded the terminal UI components to the 'tu' directory."
    exit 1
  fi
  
  # Validate source files
  if ! validate_source_files; then
    exit 1
  fi
  
  # Validate target directories
  if ! validate_target_directories; then
    exit 1
  fi
  
  # Check for existing files
  check_existing_files
  
  # List components to be installed
  echo -e "${CYAN}Components to be installed:${RESET}"
  echo -e "  ${MAGENTA}• Terminal theme CSS${RESET} (${STYLES_DIR}/terminal-theme.css)"
  echo -e "  ${MAGENTA}• Terminal theme provider${RESET} (${AUTH_COMPONENT_DIR}/TerminalThemeProvider.tsx)"
  echo -e "  ${MAGENTA}• Terminal theme switcher${RESET} (${AUTH_COMPONENT_DIR}/TerminalThemeSwitcher.tsx)"
  echo -e "  ${MAGENTA}• Enhanced matrix background${RESET} (${AUTH_COMPONENT_DIR}/EnhancedMatrixBackground.tsx)"
  echo
  
  # Confirm installation
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN MODE: No changes will be made to your codebase.${RESET}"
    echo
  else
    if ! confirm "Do you want to proceed with the installation?"; then
      log "INFO" "Installation aborted by user"
      echo -e "${YELLOW}Installation aborted.${RESET}"
      exit 0
    fi
  fi
  
  echo
  echo -e "${CYAN}Starting installation...${RESET}"
  
  # Perform installation
  if ! perform_installation; then
    if [ "$NEEDS_ROLLBACK" = true ] && [ "$DRY_RUN" = false ]; then
      if confirm "Installation failed. Do you want to rollback to the previous state?" "y"; then
        rollback
      else
        log "WARNING" "Rollback was not performed despite errors"
        echo -e "${YELLOW}Rollback was not performed. Your codebase may be in an inconsistent state.${RESET}"
      fi
    fi
    exit 1
  fi
  
  # Verify installation if not in dry run mode
  if [ "$DRY_RUN" = false ]; then
    echo
    echo -e "${CYAN}Verifying installation...${RESET}"
    
    if verify_checksums; then
      echo -e "${GREEN}Installation verified successfully!${RESET}"
    else
      echo -e "${YELLOW}Warning: Installation verification failed.${RESET}"
    fi
  fi
  
  # Print final instructions
  echo
  echo -e "${CYAN}Next steps:${RESET}"
  echo -e "  ${MAGENTA}1. Import the terminal theme CSS in your globals.css file:${RESET}"
  echo -e "     ${YELLOW}@import './terminal-theme.css';${RESET}"
  echo
  echo -e "  ${MAGENTA}2. Update your signin.tsx and signup.tsx pages to use the new components${RESET}"
  echo -e "     ${YELLOW}(See the implementation example in ${SOURCE_DIR}/terminal-implementation.tsx)${RESET}"
  echo
  echo -e "  ${MAGENTA}3. Make sure your _app.tsx includes the ThemeProvider from next-themes${RESET}"
  echo -e "     ${YELLOW}if not already present${RESET}"
  echo
  
  echo -e "${BOLD}${GREEN}Terminal UI theme installation completed successfully!${RESET}"
  echo -e "${BLUE}Detailed installation instructions are available in: ${SOURCE_DIR}/INSTALLATION.md${RESET}"
}

# Run main function with all arguments
main "$@"