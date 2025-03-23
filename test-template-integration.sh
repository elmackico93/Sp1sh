#!/bin/bash

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Testing template integration...${NC}"

# Start the development server in the background
echo -e "${YELLOW}Starting Next.js development server...${NC}"
npm run dev &
SERVER_PID=$!

# Wait for the server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 10

# Open the browser to test
if command -v xdg-open > /dev/null; then
  echo -e "${YELLOW}Opening browser on Linux...${NC}"
  xdg-open http://localhost:3000/scripts/script-1
elif command -v open > /dev/null; then
  echo -e "${YELLOW}Opening browser on macOS...${NC}"
  open http://localhost:3000/scripts/script-1
elif command -v start > /dev/null; then
  echo -e "${YELLOW}Opening browser on Windows...${NC}"
  start http://localhost:3000/scripts/script-1
else
  echo -e "${RED}Cannot detect browser opener. Please visit:${NC}"
  echo -e "${GREEN}http://localhost:3000/scripts/script-1${NC}"
fi

# Print instructions
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN}Template Integration Test${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "The development server is running in the background."
echo -e "Test the following pages:"
echo -e " - ${GREEN}http://localhost:3000/scripts/script-1${NC} (Main script detail page)"
echo -e " - ${GREEN}http://localhost:3000/scripts/script-2${NC} (Another script)"
echo -e " - ${GREEN}http://localhost:3000/categories/monitoring${NC} (Category filter)"
echo -e " - ${GREEN}http://localhost:3000/os/linux${NC} (OS filter)"
echo -e " - ${GREEN}http://localhost:3000/tags/monitoring${NC} (Tag filter)"
echo -e ""
echo -e "Press Ctrl+C to stop the test server when done."

# Wait for user to press Ctrl+C
wait $SERVER_PID
