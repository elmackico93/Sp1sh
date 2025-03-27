#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${GREEN}${BOLD}=== COMPLETE PROJECT STRUCTURE ANALYSIS ===${NC}"
echo ""

# Function to create complete project structure
generate_complete_structure() {
  echo -e "${BLUE}${BOLD}COMPLETE FILE & FOLDER HIERARCHY:${NC}"
  echo ""
  
  # Use find with a more descriptive output format
  if command -v tree &> /dev/null; then
    # Use tree if available with unlimited depth
    tree -I "node_modules|.git|.next|dist|build|coverage" --dirsfirst
  else
    # Custom implementation if tree command isn't available
    echo "Project Root (.)"
    find . -type d -o -type f | grep -v "node_modules\|\.git\|\.next\|dist\|build\|coverage" | sort | while read -r file; do
      # Calculate indentation based on directory depth
      depth=$(echo "$file" | tr -cd '/' | wc -c)
      indent=""
      for ((i=0; i<depth; i++)); do
        indent="$indent  "
      done
      
      # Print file or directory name with proper indentation
      basename=$(basename "$file")
      if [ -d "$file" ] && [ "$file" != "." ]; then
        echo "${indent}├── 📁 ${basename}/"
      elif [ -f "$file" ]; then
        # Colorize different file types
        extension="${basename##*.}"
        if [[ "$extension" == "tsx" || "$extension" == "jsx" || "$extension" == "ts" || "$extension" == "js" ]]; then
          echo "${indent}├── 📄 ${YELLOW}${basename}${NC}"
        elif [[ "$extension" == "json" || "$extension" == "config" ]]; then
          echo "${indent}├── ⚙️ ${CYAN}${basename}${NC}"
        elif [[ "$extension" == "css" || "$extension" == "scss" || "$extension" == "sass" ]]; then
          echo "${indent}├── 🎨 ${MAGENTA}${basename}${NC}"
        else
          echo "${indent}├── ${basename}"
        fi
      fi
    done
  fi
}

echo -e "${GREEN}${BOLD}=== DETAILED NEXT.JS ROUTING ANALYSIS ===${NC}"
echo ""

# Function to analyze routing files in detail
analyze_detailed_routing() {
  echo -e "${BLUE}${BOLD}COMPREHENSIVE ROUTING SCHEMA:${NC}"
  echo ""
  
  # Identify the routing system type
  is_app_router=false
  is_pages_router=false
  
  if [ -d "./app" ]; then
    is_app_router=true
    echo -e "${CYAN}App Router (Next.js 13+) Implementation Detected${NC}"
  fi
  
  if [ -d "./pages" ]; then
    is_pages_router=true
    echo -e "${CYAN}Pages Router Implementation Detected${NC}"
  fi
  
  # Detailed analysis for Pages Router
  if [ "$is_pages_router" = true ]; then
    echo ""
    echo -e "${YELLOW}${BOLD}PAGES ROUTER DETAILED ANALYSIS:${NC}"
    echo ""
    echo "├── Structure: file-system based routing"
    echo "│   ├── pages/index.tsx → / (Root route)"
    echo "│   ├── pages/about.tsx → /about"
    echo "│   └── pages/products/index.tsx → /products"
    echo "│"
    echo "├── Dynamic Routes:"
    echo "│   ├── pages/[param].tsx → /:param (e.g., /1, /abc)"
    echo "│   ├── pages/[...params].tsx → Catch-all routes (e.g., /a/b/c)"
    echo "│   └── pages/[[...params]].tsx → Optional catch-all routes"
    echo "│"
    echo "├── Nested Dynamic Routes:"
    echo "│   └── pages/[category]/[product].tsx → /:category/:product"
    echo "│"
    echo "└── Special Files:"
    echo "    ├── _app.tsx → Custom App (wraps all pages)"
    echo "    ├── _document.tsx → Custom Document (HTML structure)"
    echo "    └── 404.tsx → Custom 404 error page"
    echo ""
    
    echo -e "${YELLOW}Pages Router Routes Found:${NC}"
    echo ""
    
    # Find all pages and display them with their corresponding routes
    find ./pages -name "*.tsx" -o -name "*.jsx" -o -name "*.js" | sort | while read -r file; do
      rel_path=${file#./pages/}
      route_path=${rel_path%.tsx}
      route_path=${route_path%.jsx}
      route_path=${route_path%.js}
      
      # Format the route
      if [[ "$route_path" == "index" ]]; then
        route_path="/"
      elif [[ "$route_path" == */index ]]; then
        route_path=${route_path%/index}
        route_path="/$route_path"
      else
        route_path="/$route_path"
      fi
      
      # Replace bracket notation with param notation
      route_path=$(echo "$route_path" | sed -E 's/\[([^]]*)\]/:\1/g')
      
      # Extract route handlers and props from the file
      if [ -f "$file" ]; then
        has_get_static_props=$(grep -l "getStaticProps" "$file" || echo "")
        has_get_server_side_props=$(grep -l "getServerSideProps" "$file" || echo "")
        has_get_static_paths=$(grep -l "getStaticPaths" "$file" || echo "")
        
        data_fetching=""
        if [ -n "$has_get_static_props" ]; then
          data_fetching="${data_fetching} [SSG]"
        fi
        if [ -n "$has_get_server_side_props" ]; then
          data_fetching="${data_fetching} [SSR]"
        fi
        if [ -n "$has_get_static_paths" ]; then
          data_fetching="${data_fetching} [Static Paths]"
        fi
        
        echo "└── ${CYAN}${route_path}${NC} ← ${file#./}${data_fetching}"
      fi
    done
    
    # Check for API routes
    if [ -d "./pages/api" ]; then
      echo ""
      echo -e "${YELLOW}API Routes Found:${NC}"
      echo ""
      
      find ./pages/api -name "*.ts" -o -name "*.js" | sort | while read -r file; do
        rel_path=${file#./pages/api/}
        route_path=${rel_path%.ts}
        route_path=${route_path%.js}
        
        # Format API route
        if [[ "$route_path" == "index" ]]; then
          route_path="/api"
        else
          route_path="/api/$route_path"
        fi
        
        # Replace bracket notation with param notation
        route_path=$(echo "$route_path" | sed -E 's/\[([^]]*)\]/:\1/g')
        
        echo "└── ${MAGENTA}${route_path}${NC} ← ${file#./}"
      done
    fi
  fi
  
  # Detailed analysis for App Router
  if [ "$is_app_router" = true ]; then
    echo ""
    echo -e "${YELLOW}${BOLD}APP ROUTER DETAILED ANALYSIS:${NC}"
    echo ""
    echo "├── Structure: directory-based routing with special files"
    echo "│   ├── app/page.tsx → / (Root route)"
    echo "│   ├── app/about/page.tsx → /about"
    echo "│   └── app/products/page.tsx → /products"
    echo "│"
    echo "├── Dynamic Routes:"
    echo "│   ├── app/[param]/page.tsx → /:param"
    echo "│   ├── app/[...params]/page.tsx → Catch-all routes"
    echo "│   └── app/[[...params]]/page.tsx → Optional catch-all routes"
    echo "│"
    echo "├── Route Groups:"
    echo "│   └── app/(marketing)/about/page.tsx → /about (grouped under marketing)"
    echo "│"
    echo "├── Parallel Routes:"
    echo "│   └── app/@dashboard/page.tsx → Parallel route named 'dashboard'"
    echo "│"
    echo "└── Special Files:"
    echo "    ├── layout.tsx → Layout (wraps child routes)"
    echo "    ├── loading.tsx → Loading UI"
    echo "    ├── error.tsx → Error handling"
    echo "    └── not-found.tsx → 404 error page"
    echo ""
    
    echo -e "${YELLOW}App Router Routes Found:${NC}"
    echo ""
    
    # Find all app router page components
    find ./app -name "page.tsx" -o -name "page.jsx" | sort | while read -r file; do
      dir_path=$(dirname "$file")
      route_path=${dir_path#./app}
      
      # Format the route
      if [[ "$route_path" == "." ]]; then
        route_path="/"
      else
        route_path="/$route_path"
      fi
      
      # Remove route groups (parentheses folders) from the route path
      route_path=$(echo "$route_path" | sed -E 's/\/\([^)]*\)//g')
      
      # Replace bracket notation with param notation for display
      display_route=$(echo "$route_path" | sed -E 's/\[([^]]*)\]/:\1/g')
      
      # Check for layout, loading, error components
      has_layout=$(find "$dir_path" -name "layout.tsx" -o -name "layout.jsx" || echo "")
      has_loading=$(find "$dir_path" -name "loading.tsx" -o -name "loading.jsx" || echo "")
      has_error=$(find "$dir_path" -name "error.tsx" -o -name "error.jsx" || echo "")
      
      features=""
      if [ -n "$has_layout" ]; then
        features="${features} [Layout]"
      fi
      if [ -n "$has_loading" ]; then
        features="${features} [Loading]"
      fi
      if [ -n "$has_error" ]; then
        features="${features} [Error]"
      fi
      
      echo "└── ${CYAN}${display_route}${NC} ← ${file#./}${features}"
    done
    
    # Find all route handlers
    echo ""
    echo -e "${YELLOW}API Route Handlers Found:${NC}"
    echo ""
    
    find ./app -name "route.ts" -o -name "route.js" | sort | while read -r file; do
      dir_path=$(dirname "$file")
      route_path=${dir_path#./app}
      
      # Format the route
      if [[ "$route_path" == "." ]]; then
        route_path="/api"
      else
        route_path="/$route_path"
      fi
      
      # Remove route groups from the route path
      route_path=$(echo "$route_path" | sed -E 's/\/\([^)]*\)//g')
      
      # Replace bracket notation with param notation
      display_route=$(echo "$route_path" | sed -E 's/\[([^]]*)\]/:\1/g')
      
      # Extract HTTP methods
      http_methods=""
      if [ -f "$file" ]; then
        if grep -q "GET" "$file"; then
          http_methods="${http_methods} GET"
        fi
        if grep -q "POST" "$file"; then
          http_methods="${http_methods} POST"
        fi
        if grep -q "PUT" "$file"; then
          http_methods="${http_methods} PUT"
        fi
        if grep -q "DELETE" "$file"; then
          http_methods="${http_methods} DELETE"
        fi
        if grep -q "PATCH" "$file"; then
          http_methods="${http_methods} PATCH"
        fi
      fi
      
      echo "└── ${MAGENTA}${display_route}${NC} ← ${file#./} [${http_methods# }]"
    done
  fi
  
  # Check for middleware
  if [ -f "./middleware.ts" ] || [ -f "./middleware.js" ]; then
    echo ""
    echo -e "${YELLOW}Middleware Found:${NC}"
    echo ""
    
    if [ -f "./middleware.ts" ]; then
      echo "└── Middleware: ./middleware.ts (Applied to all routes)"
    elif [ -f "./middleware.js" ]; then
      echo "└── Middleware: ./middleware.js (Applied to all routes)"
    fi
  fi
  
  # Check for next.config.js routing configurations
  if [ -f "./next.config.js" ]; then
    echo ""
    echo -e "${YELLOW}Next.js Config Routing Settings:${NC}"
    echo ""
    
    # Check for rewrite rules
    has_rewrites=$(grep -l "rewrites" ./next.config.js || echo "")
    if [ -n "$has_rewrites" ]; then
      echo "├── URL Rewrites: ✓"
      grep -A 20 "rewrites" ./next.config.js | grep -E "source|destination" | sed 's/^/│   /'
    fi
    
    # Check for redirect rules
    has_redirects=$(grep -l "redirects" ./next.config.js || echo "")
    if [ -n "$has_redirects" ]; then
      echo "├── URL Redirects: ✓"
      grep -A 20 "redirects" ./next.config.js | grep -E "source|destination" | sed 's/^/│   /'
    fi
    
    # Check for i18n configuration
    has_i18n=$(grep -l "i18n" ./next.config.js || echo "")
    if [ -n "$has_i18n" ]; then
      echo "├── Internationalization (i18n): ✓"
      grep -A 10 "i18n" ./next.config.js | grep -E "locales|defaultLocale" | sed 's/^/│   /'
    fi
    
    # Check for basePath
    has_base_path=$(grep -l "basePath" ./next.config.js || echo "")
    if [ -n "$has_base_path" ]; then
      echo "└── Base Path: ✓"
      grep -A 1 "basePath" ./next.config.js | grep -v "basePath" | sed 's/^/    /'
    fi
  fi
}

echo -e "${GREEN}${BOLD}=== NPM DEPENDENCIES ANALYSIS ===${NC}"
echo ""

# Function to analyze all dependencies comprehensively
analyze_comprehensive_dependencies() {
  if [ -f "package.json" ]; then
    echo -e "${BLUE}${BOLD}COMPREHENSIVE DEPENDENCIES LIST:${NC}"
    echo ""
    
    # Extract core versions
    NEXT_VERSION=$(grep -E '"next"' package.json | head -1 | awk -F: '{print $2}' | tr -d '", ')
    REACT_VERSION=$(grep -E '"react"' package.json | head -1 | awk -F: '{print $2}' | tr -d '", ')
    TYPESCRIPT_VERSION=$(grep -E '"typescript"' package.json | head -1 | awk -F: '{print $2}' | tr -d '", ')
    
    echo -e "${YELLOW}${BOLD}Core Framework:${NC}"
    echo -e "├── Next.js: ${CYAN}${NEXT_VERSION}${NC}"
    echo -e "├── React: ${CYAN}${REACT_VERSION}${NC}"
    [ -n "$TYPESCRIPT_VERSION" ] && echo -e "└── TypeScript: ${CYAN}${TYPESCRIPT_VERSION}${NC}"
    echo ""
    
    # Main dependencies categorized
    echo -e "${YELLOW}${BOLD}Runtime Dependencies:${NC}"
    echo ""
    
    # Use jq if available for better JSON parsing
    if command -v jq &> /dev/null; then
      dependencies=$(jq -r '.dependencies | to_entries | .[] | "\(.key): \(.value)"' package.json)
      
      # Group dependencies by category
      ui_deps=$(echo "$dependencies" | grep -E 'react|next|@emotion|styled|tailwind|mui|@chakra|theme|chart|framer|headless|@radix|material')
      state_deps=$(echo "$dependencies" | grep -E 'redux|zustand|jotai|recoil|mobx|context|query|swr|apollo|graphql')
      util_deps=$(echo "$dependencies" | grep -E 'lodash|ramda|date-fns|moment|luxon|dayjs|uuid|nanoid|axios|fetch|http|request|jwt|auth|cookie|storage')
      other_deps=$(echo "$dependencies" | grep -v -E 'react|next|@emotion|styled|tailwind|mui|@chakra|theme|chart|framer|headless|@radix|material|redux|zustand|jotai|recoil|mobx|context|query|swr|apollo|graphql|lodash|ramda|date-fns|moment|luxon|dayjs|uuid|nanoid|axios|fetch|http|request|jwt|auth|cookie|storage')
      
      # UI & Rendering
      echo -e "${MAGENTA}UI & Rendering:${NC}"
      if [ -n "$ui_deps" ]; then
        echo "$ui_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No specialized UI libraries detected"
      fi
      echo ""
      
      # State Management
      echo -e "${MAGENTA}State Management:${NC}"
      if [ -n "$state_deps" ]; then
        echo "$state_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No specialized state management libraries detected (likely using React Context or local state)"
      fi
      echo ""
      
      # Utilities
      echo -e "${MAGENTA}Utilities:${NC}"
      if [ -n "$util_deps" ]; then
        echo "$util_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No specialized utility libraries detected"
      fi
      echo ""
      
      # Other Dependencies
      echo -e "${MAGENTA}Other Dependencies:${NC}"
      if [ -n "$other_deps" ]; then
        echo "$other_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No other dependencies detected"
      fi
      
    else
      # Fallback without jq
      echo "Dependencies (from package.json):"
      grep -A 100 '"dependencies"' package.json | grep -B 100 -m 1 '},' | grep -v '"dependencies"' | grep -v '},' | sed -e "s/^/  /"
    fi
    
    echo ""
    echo -e "${YELLOW}${BOLD}Development Dependencies:${NC}"
    echo ""
    
    # Use jq if available for better JSON parsing of dev dependencies
    if command -v jq &> /dev/null; then
      dev_dependencies=$(jq -r '.devDependencies | to_entries | .[] | "\(.key): \(.value)"' package.json 2>/dev/null || echo "")
      
      # Group dev dependencies by category
      test_deps=$(echo "$dev_dependencies" | grep -E 'jest|test|cypress|playwright|vitest|mocha|chai|sinon|enzyme|testing')
      lint_deps=$(echo "$dev_dependencies" | grep -E 'eslint|prettier|lint|stylelint|husky')
      build_deps=$(echo "$dev_dependencies" | grep -E 'webpack|babel|rollup|esbuild|vite|tsup|swc|postcss|turbopack')
      types_deps=$(echo "$dev_dependencies" | grep -E '@types')
      other_dev_deps=$(echo "$dev_dependencies" | grep -v -E 'jest|test|cypress|playwright|vitest|mocha|chai|sinon|enzyme|testing|eslint|prettier|lint|stylelint|husky|webpack|babel|rollup|esbuild|vite|tsup|swc|postcss|turbopack|@types')
      
      # Testing Tools
      echo -e "${MAGENTA}Testing Tools:${NC}"
      if [ -n "$test_deps" ]; then
        echo "$test_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No testing libraries detected"
      fi
      echo ""
      
      # Linting & Formatting
      echo -e "${MAGENTA}Linting & Formatting:${NC}"
      if [ -n "$lint_deps" ]; then
        echo "$lint_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No linting libraries detected"
      fi
      echo ""
      
      # Build Tools
      echo -e "${MAGENTA}Build Tools:${NC}"
      if [ -n "$build_deps" ]; then
        echo "$build_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No specialized build tools detected (using Next.js built-in tools)"
      fi
      echo ""
      
      # TypeScript Types
      echo -e "${MAGENTA}TypeScript Type Definitions:${NC}"
      if [ -n "$types_deps" ]; then
        echo "$types_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No TypeScript type definitions detected"
      fi
      echo ""
      
      # Other Dev Dependencies
      echo -e "${MAGENTA}Other Dev Dependencies:${NC}"
      if [ -n "$other_dev_deps" ]; then
        echo "$other_dev_deps" | while IFS=: read -r name version; do
          echo -e "├── ${name}: ${CYAN}${version}${NC}"
        done
      else
        echo "└── No other dev dependencies detected"
      fi
    else
      # Fallback without jq
      echo "Dev Dependencies (from package.json):"
      grep -A 100 '"devDependencies"' package.json | grep -B 100 -m 1 '}' | grep -v '"devDependencies"' | grep -v '}' | sed -e "s/^/  /"
    fi
  else
    echo -e "${RED}No package.json found!${NC}"
  fi
}

# Execute all functions
generate_complete_structure
echo ""
analyze_detailed_routing
echo ""
analyze_comprehensive_dependencies
echo ""

echo -e "${GREEN}${BOLD}=== ANALYSIS COMPLETE ===${NC}"
echo "This detailed analysis provides a comprehensive overview of your Next.js application structure, routing implementation, and dependencies."