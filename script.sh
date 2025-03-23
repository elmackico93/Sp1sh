#!/bin/bash
#
# ROLLBACK LAYOUT FIX CHANGES
# ==========================
# This script restores original files from backups created
# during the layout fix process.

set -euo pipefail

# Colors for better output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}    LAYOUT FIX ROLLBACK UTILITY     ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo

# Files that might have been modified
DETAIL_PAGE="pages/scripts/[id].tsx"
APP_PAGE="pages/_app.tsx"
LAYOUT_COMPONENT="components/layout/Layout.tsx"

# Check for various backup extensions
BACKUP_EXTENSIONS=(
  ".original.bak"
  ".import.bak" 
  ".head.bak"
  ".return.bak"
  ".layout-fix.bak"
  ".prop-fix"
)

RESTORED_COUNT=0

# Function to restore a file from backup
restore_from_backup() {
  local file="$1"
  local backup="$2"
  
  if [ -f "$backup" ]; then
    cp "$backup" "$file"
    echo -e "${GREEN}Restored ${file} from ${backup}${NC}"
    rm "$backup"
    echo -e "${YELLOW}Removed backup file ${backup}${NC}"
    RESTORED_COUNT=$((RESTORED_COUNT + 1))
    return 0
  fi
  return 1
}

echo -e "${YELLOW}Looking for backup files to restore...${NC}"

# Try to restore detail page from the most complete backup first
if restore_from_backup "$DETAIL_PAGE" "${DETAIL_PAGE}.original.bak"; then
  echo -e "${GREEN}Successfully restored detail page from original backup${NC}"
else
  # Try other possible backups in priority order
  for ext in "${BACKUP_EXTENSIONS[@]}"; do
    if [ -f "${DETAIL_PAGE}${ext}" ]; then
      restore_from_backup "$DETAIL_PAGE" "${DETAIL_PAGE}${ext}"
      break
    fi
  done
fi

# Check for app page backups
if [ -f "${APP_PAGE}.layout-fix.bak" ]; then
  restore_from_backup "$APP_PAGE" "${APP_PAGE}.layout-fix.bak"
fi

# Check for Layout component backups
if [ -f "${LAYOUT_COMPONENT}.layout-fix.bak" ]; then
  restore_from_backup "$LAYOUT_COMPONENT" "${LAYOUT_COMPONENT}.layout-fix.bak"
fi

# Clean up any temporary files
echo -e "${YELLOW}Cleaning up temporary files...${NC}"
find . -name "*.tmp" -type f -delete
echo -e "${GREEN}Removed temporary files${NC}"

# Search for any other backup files we might have missed
echo -e "${YELLOW}Checking for other backup files from layout fixes...${NC}"
OTHER_BACKUPS=$(find . -name "*.layout-fix.bak" -o -name "*.original.bak" -o -name "*.import.bak" -o -name "*.head.bak" -o -name "*.return.bak" -o -name "*.prop-fix")

if [ -n "$OTHER_BACKUPS" ]; then
  echo -e "${YELLOW}Found additional backup files:${NC}"
  echo "$OTHER_BACKUPS"
  
  read -p "Do you want to restore these files too? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    while IFS= read -r backup; do
      original="${backup%.*}"
      original="${original%.*}"
      restore_from_backup "$original" "$backup"
    done <<< "$OTHER_BACKUPS"
  fi
fi

if [ $RESTORED_COUNT -eq 0 ]; then
  echo -e "${YELLOW}No backup files found. Nothing was restored.${NC}"
  echo -e "${YELLOW}If you're experiencing issues, you might need to restore files manually or from your version control system.${NC}"
else
  echo -e "${GREEN}Successfully restored $RESTORED_COUNT files from backups!${NC}"
  echo -e "${GREEN}Your code has been rolled back to the state before layout fixes were applied.${NC}"
fi

echo
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}    ROLLBACK PROCESS COMPLETED      ${NC}"
echo -e "${BLUE}=====================================${NC}"