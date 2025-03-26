#!/bin/bash
# Test category routes to ensure they're working properly

set -e

# Define colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Test URLs
URLS=(
  "http://localhost:3000/categories/system-admin"
  "http://localhost:3000/categories/security"
  "http://localhost:3000/categories/network"
  "http://localhost:3000/categories/automation"
  "http://localhost:3000/categories/beginners"
  "http://localhost:3000/categories/cloud-containers"
  "http://localhost:3000/categories/dev-tools"
  "http://localhost:3000/categories/devops-cicd"
  "http://localhost:3000/emergency/disaster-recovery"
  "http://localhost:3000/emergency/forensics"
  "http://localhost:3000/emergency/incident-response"
)

echo -e "${BLUE}Starting route tests...${RESET}"
echo -e "${BLUE}Ensure your Next.js server is running on port 3000${RESET}"
echo ""

# Test each URL
for url in "${URLS[@]}"; do
  echo -e "Testing: ${url}"
  if curl -s -o /dev/null -w "%{http_code}" "${url}" | grep -q "200"; then
    echo -e "${GREEN}✓ Success: ${url}${RESET}"
  else
    echo -e "${RED}✗ Failure: ${url}${RESET}"
  fi
done

echo ""
echo -e "${BLUE}Tests completed.${RESET}"
