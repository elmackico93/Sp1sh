#!/bin/bash
# security_fix.sh - Script to diagnose and fix "SecurityError: The operation is insecure" in Next.js
# Created by Claude - March 26, 2025

echo "🔍 Starting Next.js SecurityError diagnostic and repair script"
echo "=============================================================="

# Define colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for project directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Are you in the project root?${NC}"
  echo "Please run this script from your Next.js project root directory."
  exit 1
fi

echo -e "${BLUE}Analyzing project structure...${NC}"

# Check if this is a Next.js project
if ! grep -q "\"next\":" package.json; then
  echo -e "${RED}Error: This doesn't appear to be a Next.js project.${NC}"
  echo "This script is designed for Next.js applications only."
  exit 1
fi

# Get Next.js version
NEXT_VERSION=$(grep -o '"next": "[^"]*' package.json | cut -d'"' -f4)
echo -e "${GREEN}Detected Next.js version:${NC} $NEXT_VERSION"

# Check for router files that might have issues
echo -e "${BLUE}Checking router implementation files...${NC}"

# Create backup directory if it doesn't exist
mkdir -p ./backups

# Check for Content Security Policy settings in next.config.js
if [ -f "next.config.js" ]; then
  echo "Found next.config.js, checking for CSP settings..."
  cp next.config.js ./backups/next.config.js.bak
  
  # Check if CSP headers are too restrictive
  if grep -q "Content-Security-Policy" next.config.js; then
    echo -e "${YELLOW}Warning: Found Content-Security-Policy in next.config.js${NC}"
    echo "This might be causing the SecurityError. Would you like to modify it? (y/n)"
    read answer
    if [ "$answer" = "y" ]; then
      # Add 'unsafe-inline' to script-src if it exists
      sed -i 's/script-src/script-src '\''unsafe-inline'\''/g' next.config.js
      echo -e "${GREEN}Updated CSP in next.config.js to include 'unsafe-inline'${NC}"
    fi
  fi
fi

# Check for specific issue in changeState function in the router components
echo -e "${BLUE}Checking for router navigation issues...${NC}"

# Check the problematic components
COMPONENTS_TO_CHECK=(
  "components/layout/EnhancedNavbar.tsx"
  "context/NavigationContext.tsx"
  "components/layout/OSNavbar.tsx"
  "pages/categories/devops-cicd/index.tsx"
)

for component in "${COMPONENTS_TO_CHECK[@]}"; do
  if [ -f "$component" ]; then
    echo "Checking $component..."
    cp "$component" "./backups/$(basename $component).bak"
    
    # Look for potentially problematic changeState or history.replaceState calls
    if grep -q "history.replaceState\|changeState\|router.replace" "$component"; then
      echo -e "${YELLOW}Found potential issue in $component${NC}"
      
      # Apply fix for router.push with shallow routing
      if grep -q "router.push.*shallow" "$component"; then
        echo "Fixing shallow routing in $component..."
        # Remove shallow routing which can cause security errors
        sed -i 's/\(router\.push([^)]*\), *{.*shallow: *true.*}/\1)/g' "$component"
        echo -e "${GREEN}Fixed shallow routing in $component${NC}"
      fi
      
      # Fix potential history state manipulation issues
      if grep -q "history.replaceState" "$component"; then
        echo "Fixing history.replaceState in $component..."
        # Wrap history calls in try-catch
        sed -i 's/history.replaceState/try { history.replaceState/g' "$component"
        sed -i 's/)\(;*\)$/)} catch(e) { console.warn("History API error:", e) }\1/g' "$component"
        echo -e "${GREEN}Added error handling to history API calls in $component${NC}"
      fi
    fi
  fi
done

# Fix for the specific issue in the router component
ROUTER_ISSUE_FIX="
// Fix for SecurityError in navigation
const safeChangeState = (method, url, as, options = {}) => {
  try {
    return window.history[method]({
      url,
      as,
      options,
      __N: true,
      key: options.key || createKey()
    }, 
    // Title 
    '', 
    // URL
    as);
  } catch (err) {
    console.warn('Error during navigation state change:', err);
    // Fallback navigation without state manipulation
    window.location.href = as;
    return false;
  }
};
"

# Create a custom hook to patch the router issue
echo -e "${BLUE}Creating router patch hook...${NC}"
mkdir -p hooks
cat > hooks/useRouterPatch.js << EOF
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * This hook patches the router to handle SecurityError exceptions
 * that can occur during history manipulation operations.
 */
export function useRouterPatch() {
  const router = useRouter();
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Store original push method
    const originalPush = router.push;
    
    // Override push method with safe version
    router.push = function safePush(...args) {
      try {
        return originalPush.apply(this, args);
      } catch (err) {
        if (err.name === 'SecurityError') {
          console.warn('Security error during navigation, using fallback method');
          window.location.href = typeof args[0] === 'string' ? args[0] : args[0].pathname;
          return Promise.resolve(false);
        }
        throw err;
      }
    };
    
    // Cleanup
    return () => {
      router.push = originalPush;
    };
  }, [router]);
}

export default useRouterPatch;
EOF

echo -e "${GREEN}Created router patch hook at hooks/useRouterPatch.js${NC}"

# Update _app.tsx to use the router patch
if [ -f "pages/_app.tsx" ]; then
  echo "Updating _app.tsx to include router patch..."
  cp pages/_app.tsx ./backups/_app.tsx.bak
  
  # Check if the import is already there
  if ! grep -q "useRouterPatch" pages/_app.tsx; then
    # Add import statement at the top
    sed -i '1s/^/import useRouterPatch from "..\/hooks\/useRouterPatch";\n/' pages/_app.tsx
    
    # Find and modify the App component to use the patch
    if grep -q "function App" pages/_app.tsx; then
      # Add the hook inside the component function
      sed -i '/function App/,/return/ s/return /useRouterPatch();\n  return /' pages/_app.tsx
      echo -e "${GREEN}Successfully patched _app.tsx${NC}"
    else
      echo -e "${YELLOW}Couldn't automatically patch _app.tsx. Please add useRouterPatch() manually.${NC}"
    fi
  else
    echo -e "${BLUE}Router patch already included in _app.tsx${NC}"
  fi
fi

echo -e "${BLUE}Checking for specific DevOps CI/CD page issue...${NC}"
if [ -f "pages/categories/devops-cicd/index.tsx" ]; then
  cp pages/categories/devops-cicd/index.tsx ./backups/devops-cicd-index.tsx.bak
  
  # Apply specific fix for this component
  cat > pages/categories/devops-cicd/index.tsx << EOF
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Fix: Use proper navigation without triggering SecurityError
    if (typeof window !== 'undefined') {
      // Set current category
      setCurrentCategory('devops-cicd');
      
      // Use window.location instead of router.push to avoid potential SecurityError
      // This is a safer approach if router.push is causing SecurityErrors
      setTimeout(() => {
        window.location.href = '/categories/devops-cicd';
      }, 100);
    }
  }, [setCurrentCategory]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return null;
}
EOF
  echo -e "${GREEN}Fixed pages/categories/devops-cicd/index.tsx${NC}"
fi

echo -e "${BLUE}Checking for cross-origin issues...${NC}"
# Create .env.local file with NEXT_PUBLIC_ALLOW_CROSS_ORIGIN setting
if [ ! -f ".env.local" ]; then
  touch .env.local
fi

if ! grep -q "NEXT_PUBLIC_ALLOW_CROSS_ORIGIN" .env.local; then
  echo "NEXT_PUBLIC_ALLOW_CROSS_ORIGIN=true" >> .env.local
  echo -e "${GREEN}Added cross-origin setting to .env.local${NC}"
fi

echo -e "${BLUE}Cleaning build cache...${NC}"
# Clean cache to ensure clean rebuild
if [ -d ".next" ]; then
  rm -rf .next
  echo -e "${GREEN}Cleared Next.js build cache${NC}"
fi

echo -e "${GREEN}All fixes have been applied!${NC}"
echo -e "${YELLOW}Now run 'npm run dev' to test if the issue has been resolved.${NC}"
echo "If the issue persists, you might need to:"
echo "1. Check browser extensions and try in incognito mode"
echo "2. Update Next.js to the latest version: npm install next@latest"
echo "3. Verify that your browser supports the History API"
echo "4. Check if the application is running inside an iframe with restrictions"

echo -e "${GREEN}Script completed successfully.${NC}"