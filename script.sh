#!/bin/bash
# =============================================================================
# Repository Cleanup Utility
# =============================================================================
# Author: System Administrator
# Version: 1.0.0
# Created: March 2025
# 
# This script identifies temporary and backup files in a repository, presents
# them in a list, and offers the option to delete them individually or in batch.
# It helps maintain repository cleanliness by removing unnecessary files.
# =============================================================================

# Text formatting colors
CYAN="\033[0;36m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
BOLD="\033[1m"
RESET="\033[0m"

# Define the repository root (use git root if available, current directory otherwise)
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
TEMP_LIST_FILE=$(mktemp)
SKIPPED_FILES_COUNT=0
DELETED_FILES_COUNT=0
BATCH_MODE=false
INTERACTIVE_MODE=true
VERBOSE_MODE=false
DRY_RUN=false

# Banner display
show_banner() {
    echo -e "${BLUE}${BOLD}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║                                                               ║"
    echo "║                   REPOSITORY CLEANUP UTILITY                  ║"
    echo "║                                                               ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo "This utility will identify temporary and backup files in your repository,"
    echo "allowing you to remove them individually or in batch."
    echo
    echo -e "${YELLOW}Repository: ${RESET}${REPO_ROOT}"
    echo
}

# Help message
show_help() {
    echo "Usage: $(basename "$0") [options]"
    echo
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -b, --batch         Batch mode (don't prompt for each file)"
    echo "  -y, --yes           Delete all found files without prompting"
    echo "  -v, --verbose       Show more details about the operations"
    echo "  -d, --dry-run       Show what would be deleted without actually deleting"
    echo
    echo "Examples:"
    echo "  $(basename "$0")              # Run in interactive mode"
    echo "  $(basename "$0") --batch      # List files and ask once for all files"
    echo "  $(basename "$0") --yes        # Delete all matched files without asking"
    echo "  $(basename "$0") --dry-run    # Show what would be deleted without deleting"
    echo
}

# Parse command line arguments
parse_arguments() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -b|--batch)
                BATCH_MODE=true
                ;;
            -y|--yes)
                INTERACTIVE_MODE=false
                ;;
            -v|--verbose)
                VERBOSE_MODE=true
                ;;
            -d|--dry-run)
                DRY_RUN=true
                ;;
            *)
                echo -e "${RED}Unknown option: $1${RESET}"
                show_help
                exit 1
                ;;
        esac
        shift
    done
}

# Function to find temporary and backup files
find_temp_files() {
    echo -e "${YELLOW}Searching for temporary and backup files...${RESET}"
    
    # Common temporary file patterns
    local patterns=(
        # Backup files
        "*.bak"
        "*.backup"
        "*.old"
        "*~"
        "*.orig"
        "*.copy"
        "*.tmp"
        
        # Automatic backups by editors
        "*.swp"
        ".*.swp"
        "*.swo"
        ".*.swo"
        "*~"
        "*.autosave"
        "*.bak.*"
        "*-bak*"
        "*.back"
        "*.backup.*"
        "*_BACKUP_*"
        
        # Timestamp backups
        "*.20*"
        "*.19*"
        "*.[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]"
        "*.[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]_[0-9][0-9][0-9][0-9][0-9][0-9]"
        
        # IDE specific backup files
        "*.iml.bak"
        "*.cs.bak"
        "*.vb.bak"
        "*.java.bak"
        "*.py.bak"
        "*.rb.bak"
        "*.php.bak"
        "*.js.bak"
        "*.ts.bak"
        "*.jsx.bak"
        "*.tsx.bak"
        "*.vue.bak"
        "*.c.bak"
        "*.cpp.bak"
        "*.h.bak"
        
        # VS Code backups
        "*.ts.*.bak"
        
        # Merge conflict files
        "*.orig"
        "*.BACKUP.*"
        "*.BASE.*"
        "*.LOCAL.*"
        "*.REMOTE.*"
        
        # Temp files
        "*.temp"
        "temp_*"
        "tmp_*"
        "*.tmp.*"
        
        # Log files
        "*.log"
        "*.log.*"
        
        # Cache files
        ".sass-cache"
        "*.cache"
        ".cache"
        
        # Automatic file versions
        "*(copy)*"
        "*copy [0-9]*"
        "*copy [0-9][0-9]*"
        
        # npm/yarn debug
        "npm-debug.log*"
        "yarn-debug.log*"
        "yarn-error.log*"
    )
    
    # Use find to search for files matching the patterns
    local total_files=0
    
    for pattern in "${patterns[@]}"; do
        if [ "$VERBOSE_MODE" = true ]; then
            echo -e "  Looking for pattern: ${CYAN}${pattern}${RESET}"
        fi
        
        # Use find to look for matching files, but exclude hidden directories like .git
        find "$REPO_ROOT" -type f -name "$pattern" -not -path "*/\.*/*" -not -path "*/node_modules/*" >> "$TEMP_LIST_FILE"
        
        # Exit early if interrupted
        if [ $? -ne 0 ]; then
            break
        fi
    done
    
    # Count the total number of files found
    total_files=$(wc -l < "$TEMP_LIST_FILE")
    
    if [ "$total_files" -eq 0 ]; then
        echo -e "${GREEN}No temporary or backup files found.${RESET}"
        clean_up
        exit 0
    else
        echo -e "${YELLOW}Found ${BOLD}${total_files}${RESET}${YELLOW} potential temporary/backup files.${RESET}"
        echo
    fi
}

# Function to confirm deletion of a file
confirm_deletion() {
    local file="$1"
    local prompt="$2"
    
    echo -ne "$prompt"
    read -r response
    
    case "$response" in
        [Yy]|[Yy][Ee][Ss])
            return 0  # Confirm deletion
            ;;
        [Nn]|[Nn][Oo])
            return 1  # Skip deletion
            ;;
        [Aa][Ll][Ll])
            INTERACTIVE_MODE=false
            return 0  # Delete all remaining
            ;;
        [Ss][Kk][Ii][Pp][Aa][Ll][Ll])
            BATCH_MODE=true
            return 1  # Skip all remaining
            ;;
        [Qq][Uu][Ii][Tt]|[Ee][Xx][Ii][Tt])
            echo -e "${YELLOW}Operation aborted by user.${RESET}"
            clean_up
            exit 0
            ;;
        *)
            echo -e "${YELLOW}Invalid response. Please answer 'y' (yes), 'n' (no), 'all', 'skipall', or 'quit'.${RESET}"
            confirm_deletion "$file" "$prompt"
            ;;
    esac
}

# Function to delete files one by one
process_files_individually() {
    local total_files=$(wc -l < "$TEMP_LIST_FILE")
    local counter=0
    
    echo -e "${YELLOW}Processing files individually:${RESET}"
    echo -e "${CYAN}Commands: 'y' (yes), 'n' (no), 'all' (delete all), 'skipall' (skip all), 'quit' (exit)${RESET}"
    echo
    
    while IFS= read -r file; do
        counter=$((counter + 1))
        
        # Show file info
        echo -e "${YELLOW}[$counter/$total_files]${RESET} ${file}"
        
        # Show file details if verbose mode is enabled
        if [ "$VERBOSE_MODE" = true ]; then
            file_size=$(du -h "$file" 2>/dev/null | cut -f1)
            file_date=$(stat -c %y "$file" 2>/dev/null || stat -f "%Sm" "$file" 2>/dev/null)
            echo -e "  ${CYAN}Size:${RESET} $file_size"
            echo -e "  ${CYAN}Modified:${RESET} $file_date"
            echo -e "  ${CYAN}Type:${RESET} $(file -b "$file" | cut -d, -f1)"
        fi
        
        # Ask for confirmation
        if [ "$INTERACTIVE_MODE" = true ]; then
            if confirm_deletion "$file" "${YELLOW}Delete this file? [y/n/all/skipall/quit]:${RESET} "; then
                if [ "$DRY_RUN" = true ]; then
                    echo -e "  ${GREEN}Would delete:${RESET} $file"
                else
                    rm -f "$file"
                    echo -e "  ${GREEN}Deleted:${RESET} $file"
                    DELETED_FILES_COUNT=$((DELETED_FILES_COUNT + 1))
                fi
            else
                echo -e "  ${BLUE}Skipped:${RESET} $file"
                SKIPPED_FILES_COUNT=$((SKIPPED_FILES_COUNT + 1))
            fi
        else
            # Non-interactive mode: delete all files
            if [ "$DRY_RUN" = true ]; then
                echo -e "  ${GREEN}Would delete:${RESET} $file"
            else
                rm -f "$file"
                echo -e "  ${GREEN}Deleted:${RESET} $file"
                DELETED_FILES_COUNT=$((DELETED_FILES_COUNT + 1))
            fi
        fi
        
        echo
    done < "$TEMP_LIST_FILE"
}

# Function to process files in batch mode
process_files_in_batch() {
    local total_files=$(wc -l < "$TEMP_LIST_FILE")
    
    echo -e "${YELLOW}Found ${total_files} temporary/backup files:${RESET}"
    echo
    
    # Display all files
    local counter=0
    while IFS= read -r file; do
        counter=$((counter + 1))
        if [ "$VERBOSE_MODE" = true ]; then
            file_size=$(du -h "$file" 2>/dev/null | cut -f1)
            echo -e "${CYAN}[$counter]${RESET} ${file} (${file_size})"
        else
            echo -e "${CYAN}[$counter]${RESET} ${file}"
        fi
    done < "$TEMP_LIST_FILE"
    
    echo
    
    # Ask for confirmation to delete all files
    if [ "$INTERACTIVE_MODE" = true ]; then
        if confirm_deletion "all" "${YELLOW}Delete all ${total_files} files? [y/n/quit]:${RESET} "; then
            if [ "$DRY_RUN" = true ]; then
                echo -e "${GREEN}Would delete all ${total_files} files.${RESET}"
            else
                while IFS= read -r file; do
                    rm -f "$file"
                    DELETED_FILES_COUNT=$((DELETED_FILES_COUNT + 1))
                done < "$TEMP_LIST_FILE"
                echo -e "${GREEN}Deleted all ${DELETED_FILES_COUNT} files.${RESET}"
            fi
        else
            echo -e "${BLUE}Operation cancelled. No files were deleted.${RESET}"
            SKIPPED_FILES_COUNT=$total_files
        fi
    else
        # Non-interactive mode: delete all files
        if [ "$DRY_RUN" = true ]; then
            echo -e "${GREEN}Would delete all ${total_files} files.${RESET}"
        else
            while IFS= read -r file; do
                rm -f "$file"
                DELETED_FILES_COUNT=$((DELETED_FILES_COUNT + 1))
            done < "$TEMP_LIST_FILE"
            echo -e "${GREEN}Deleted all ${DELETED_FILES_COUNT} files.${RESET}"
        fi
    fi
}

# Function to delete files based on user selection
process_files() {
    if [ "$BATCH_MODE" = true ]; then
        process_files_in_batch
    else
        process_files_individually
    fi
}

# Function to clean up temporary files
clean_up() {
    if [ -f "$TEMP_LIST_FILE" ]; then
        rm -f "$TEMP_LIST_FILE"
    fi
}

# Function to show a summary of operations
show_summary() {
    echo
    echo -e "${BLUE}${BOLD}Operation Summary:${RESET}"
    echo -e "${GREEN}Files deleted: ${DELETED_FILES_COUNT}${RESET}"
    echo -e "${BLUE}Files skipped: ${SKIPPED_FILES_COUNT}${RESET}"
    
    if [ "$DRY_RUN" = true ]; then
        echo
        echo -e "${YELLOW}Note: This was a dry run. No files were actually deleted.${RESET}"
    fi
}

# Main function
main() {
    show_banner
    parse_arguments "$@"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}Running in dry-run mode. No files will be deleted.${RESET}"
        echo
    fi
    
    find_temp_files
    process_files
    show_summary
    clean_up
}

# Execute main function
main "$@"