#!/bin/bash

# ===================================================================
# Matrix Color Enhancement Rollback Script for SP1SH
# ===================================================================
#
# This script rolls back the changes made by the enhance-light-mode-colors.sh
# script, restoring the Matrix background to its previous state.
#
# Usage: ./rollback-matrix-colors.sh [--force] [--backup-dir=PATH]
#
# Options:
#   --force           Skip confirmation prompts
#   --backup-dir=PATH Specify a particular backup directory to restore from

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
BACKUPS_ROOT="./tu/backups"
LOG_FILE="./tu/logs/rollback-$(date +%Y%m%d-%H%M%S).log"
MATRIX_COMPONENT="./components/auth/EnhancedMatrixBackground.tsx"
CUSTOM_BACKUP_DIR=""

# Force mode flag
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

# Function to find the most recent matrix-colors backup directory
find_latest_backup() {
  log "INFO" "Searching for the most recent matrix color backup"
  
  if [ ! -d "$BACKUPS_ROOT" ]; then
    log "ERROR" "Backups directory not found: ${BACKUPS_ROOT}"
    return 1
  fi
  
  # Find directories that match the matrix-colors pattern
  local backup_dirs=($(find "$BACKUPS_ROOT" -maxdepth 1 -type d -name "matrix-colors-*" | sort -r))
  
  if [ ${#backup_dirs[@]} -eq 0 ]; then
    log "ERROR" "No matrix color backups found in ${BACKUPS_ROOT}"
    return 1
  fi
  
  # Return the most recent backup directory
  echo "${backup_dirs[0]}"
  return 0
}

# Function to roll back matrix component
rollback_matrix_component() {
  local backup_dir="$1"
  log "INFO" "Rolling back Matrix component from backup: ${backup_dir}"
  
  # Check if the backup directory exists
  if [ ! -d "$backup_dir" ]; then
    log "ERROR" "Backup directory not found: ${backup_dir}"
    return 1
  fi
  
  # Check if the backup file exists
  local backup_file="${backup_dir}/${MATRIX_COMPONENT}"
  if [ ! -f "$backup_file" ]; then
    log "ERROR" "Backup file not found: ${backup_file}"
    return 1
  fi
  
  # Check if the target file exists
  if [ ! -f "$MATRIX_COMPONENT" ]; then
    log "WARNING" "Target file does not exist: ${MATRIX_COMPONENT}"
    log "INFO" "Creating directory structure for target file"
    mkdir -p "$(dirname "$MATRIX_COMPONENT")"
  fi
  
  # Restore the file
  cp -p "$backup_file" "$MATRIX_COMPONENT"
  
  if [ $? -eq 0 ]; then
    log "SUCCESS" "Successfully restored Matrix component from backup"
    return 0
  else
    log "ERROR" "Failed to restore Matrix component"
    return 1
  fi
}

# Process command line arguments
for arg in "$@"; do
  case $arg in
    --force)
      FORCE_MODE=true
      log "INFO" "Force mode enabled"
      ;;
    --backup-dir=*)
      CUSTOM_BACKUP_DIR="${arg#*=}"
      log "INFO" "Using custom backup directory: ${CUSTOM_BACKUP_DIR}"
      ;;
    *)
      echo -e "${RED}Unknown argument: $arg${RESET}"
      echo "Usage: $(basename "$0") [--force] [--backup-dir=PATH]"
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
  echo "║     Matrix Color Enhancement Rollback                  ║"
  echo "║                                                        ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  
  # Determine which backup directory to use
  local backup_dir=""
  if [ -n "$CUSTOM_BACKUP_DIR" ]; then
    backup_dir="$CUSTOM_BACKUP_DIR"
  else
    backup_dir=$(find_latest_backup)
    if [ $? -ne 0 ]; then
      echo -e "${RED}Failed to find a matrix color backup.${RESET}"
      echo "If you know the specific backup directory, specify it with --backup-dir=PATH"
      exit 1
    fi
  fi
  
  echo -e "${YELLOW}This script will roll back the Matrix background to its previous state:${RESET}"
  echo -e "  ${MAGENTA}• Restore EnhancedMatrixBackground.tsx from backup${RESET}"
  echo -e "  ${MAGENTA}• Revert to the previous color scheme${RESET}"
  echo
  echo -e "${BLUE}Backup source: ${backup_dir}${RESET}"
  echo
  
  if ! confirm "Do you want to proceed with the rollback?"; then
    echo -e "${YELLOW}Rollback cancelled.${RESET}"
    exit 0
  fi
  
  echo
  
  # Apply rollback
  echo -e "${CYAN}Rolling back changes...${RESET}"
  
  # Rollback Matrix component
  rollback_matrix_component "$backup_dir"
  echo
  
  # Done
  echo -e "${GREEN}Matrix background has been rolled back successfully!${RESET}"
  echo -e "${BLUE}Rollback details have been logged to: ${LOG_FILE}${RESET}"
  
  # Recommend next steps
  echo
  echo -e "${CYAN}Next Steps:${RESET}"
  echo -e "  ${MAGENTA}1. Restart your development server${RESET}"
  echo -e "  ${MAGENTA}2. Verify that the Matrix background has been restored to its previous state${RESET}"
}

# Run main function
main