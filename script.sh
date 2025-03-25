#!/bin/bash
#
# Next.js Routing Diagnostic & Fix Script
# Version: 1.0.0
#
# This script analyzes and fixes common routing issues in Next.js applications
# including internationalization problems, redirect loops, and CSP settings.
#
# Usage: ./nextjs-routing-fix.sh [--fix]
# --fix: Apply recommended fixes automatically (use with caution)

set -e

# Text formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
NEXT_CONFIG="next.config.js"
PAGES_DIR="pages"
AUTO_FIX=false

# Parse command line arguments
for arg in "$@"; do
  case $arg in
    --fix)
      AUTO_FIX=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--fix]"
      echo "  --fix: Apply recommended fixes automatically (use with caution)"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo -e "${BOLD}Next.js Routing Diagnostic & Fix Script${NC}"
echo "------------------------------------------------"
echo -e "Analyzing your Next.js application...\n"

# Function to check if a file exists
file_exists() {
  if [ -f "$1" ]; then
    return 0
  else
    return 1
  fi
}

# Function to check if a directory exists
dir_exists() {
  if [ -d "$1" ]; then
    return 0
  else
    return 1
  fi
}

# Check if Next.js configuration files exist
check_config_files() {
  echo -e "${BOLD}1. Checking configuration files${NC}"
  
  if file_exists "$NEXT_CONFIG"; then
    echo -e "  ${GREEN}✓${NC} Found $NEXT_CONFIG"
  else
    echo -e "  ${RED}✗${NC} Missing $NEXT_CONFIG"
    echo -e "    ${YELLOW}!${NC} Create a basic Next.js config file"
    if [ "$AUTO_FIX" = true ]; then
      echo "module.exports = {
  reactStrictMode: true,
};" > "$NEXT_CONFIG"
      echo -e "    ${GREEN}✓${NC} Created basic $NEXT_CONFIG"
    fi
  fi
  
  if dir_exists "$PAGES_DIR"; then
    echo -e "  ${GREEN}✓${NC} Found pages directory"
  else
    echo -e "  ${RED}✗${NC} Missing pages directory"
    echo -e "    ${YELLOW}!${NC} Create a pages directory for your routes"
    if [ "$AUTO_FIX" = true ]; then
      mkdir -p "$PAGES_DIR"
      echo -e "    ${GREEN}✓${NC} Created $PAGES_DIR directory"
    fi
  fi
  
  echo ""
}

# Check for internationalization (i18n) issues
check_i18n_config() {
  echo -e "${BOLD}2. Checking internationalization (i18n) configuration${NC}"
  
  if ! file_exists "$NEXT_CONFIG"; then
    echo -e "  ${YELLOW}!${NC} Cannot check i18n config: $NEXT_CONFIG not found"
    return
  fi
  
  # Check if i18n is configured
  if grep -q "i18n" "$NEXT_CONFIG"; then
    echo -e "  ${GREEN}✓${NC} i18n configuration found"
    
    # Extract locales from config
    LOCALES=$(grep -A10 "i18n" "$NEXT_CONFIG" | grep -E "locales.*\[" | sed -E 's/.*\[(.*)\].*/\1/' | tr -d ' ')
    DEFAULT_LOCALE=$(grep -A10 "i18n" "$NEXT_CONFIG" | grep "defaultLocale" | sed -E "s/.*defaultLocale.*['\"](.*)['\"]/\1/" | tr -d ' ,')
    
    echo -e "    Detected locales: $LOCALES"
    echo -e "    Default locale: $DEFAULT_LOCALE"
    
    # Look for potential issues
    check_locale_redirects
  else
    echo -e "  ${YELLOW}!${NC} No i18n configuration found"
    echo -e "    If you're using multiple languages, consider adding i18n config"
  fi
  
  echo ""
}

# Check for redirect loops in locale handling
check_locale_redirects() {
  echo -e "  ${BOLD}Checking for potential redirect loops in locale handling${NC}"
  
  # Look for dynamic routes with immediate redirects
  DYNAMIC_ROUTES=$(find "$PAGES_DIR" -name "\[*.tsx" -o -name "\[*.jsx" -o -name "\[*.js")
  REDIRECT_COUNT=0
  
  for route in $DYNAMIC_ROUTES; do
    if grep -q "router.push" "$route" && grep -q "useEffect" "$route"; then
      REDIRECT_COUNT=$((REDIRECT_COUNT + 1))
      echo -e "    ${YELLOW}!${NC} Potential redirect loop in $route"
      
      if [ "$AUTO_FIX" = true ]; then
        # Create backup
        cp "$route" "${route}.bak"
        
        # Add condition to prevent redirect loops
        sed -i.tmp '/router.push.*useEffect/ {
          s/useEffect\(.*\){\(.*\)router.push\(.*\)}/useEffect\1{\
    if (router.pathname !== router.asPath) {\2router.push\3}\
  }/
        }' "$route"
        rm -f "${route}.tmp"
        echo -e "    ${GREEN}✓${NC} Added conditional check to prevent redirect loop"
      fi
    fi
  done
  
  if [ $REDIRECT_COUNT -eq 0 ]; then
    echo -e "    ${GREEN}✓${NC} No obvious redirect loops found"
  fi
}

# Check for issues with dynamic routes
check_dynamic_routes() {
  echo -e "${BOLD}3. Checking dynamic routes${NC}"
  
  # Look for dynamic route files
  DYNAMIC_ROUTES=$(find "$PAGES_DIR" -name "\[*.tsx" -o -name "\[*.jsx" -o -name "\[*.js")
  CATCHALL_ROUTES=$(find "$PAGES_DIR" -name "\[\[\.\.\.*" -o -name "\[\.\.\.*")
  
  if [ -z "$DYNAMIC_ROUTES" ]; then
    echo -e "  ${YELLOW}!${NC} No dynamic routes found"
  else
    echo -e "  ${GREEN}✓${NC} Found $(echo "$DYNAMIC_ROUTES" | wc -l | tr -d ' ') dynamic route files"
    
    # Check for potentially conflicting routes
    check_route_conflicts
  fi
  
  if [ -n "$CATCHALL_ROUTES" ]; then
    echo -e "  ${GREEN}✓${NC} Found $(echo "$CATCHALL_ROUTES" | wc -l | tr -d ' ') catch-all routes"
    
    # Check for catch-all routes that might override specific routes
    for catchall in $CATCHALL_ROUTES; do
      DIR=$(dirname "$catchall")
      if [ "$(find "$DIR" -name "*.tsx" -o -name "*.jsx" -o -name "*.js" | wc -l)" -gt 1 ]; then
        echo -e "    ${YELLOW}!${NC} Catch-all route $catchall might override other routes in the same directory"
      fi
    done
  fi
  
  echo ""
}

# Check for conflicting route patterns
check_route_conflicts() {
  # Check for potentially conflicting routes like [id].js and [slug].js in same directory
  CONFLICTS=0
  
  for dir in $(find "$PAGES_DIR" -type d); do
    DYNAMIC_FILES=$(find "$dir" -maxdepth 1 -name "\[*.tsx" -o -name "\[*.jsx" -o -name "\[*.js" | wc -l)
    if [ "$DYNAMIC_FILES" -gt 1 ]; then
      echo -e "    ${YELLOW}!${NC} Potential route conflict in $dir"
      echo -e "      Multiple dynamic route files in the same directory may cause conflicts"
      CONFLICTS=$((CONFLICTS + 1))
    fi
  done
  
  if [ $CONFLICTS -eq 0 ]; then
    echo -e "    ${GREEN}✓${NC} No obvious route conflicts found"
  fi
}

# Check Content Security Policy settings
check_csp_settings() {
  echo -e "${BOLD}4. Checking Content Security Policy settings${NC}"
  
  if ! file_exists "$NEXT_CONFIG"; then
    echo -e "  ${YELLOW}!${NC} Cannot check CSP settings: $NEXT_CONFIG not found"
    return
  fi
  
  if grep -q "Content-Security-Policy" "$NEXT_CONFIG"; then
    echo -e "  ${GREEN}✓${NC} CSP configuration found"
    
    # Check for overly restrictive CSP
    if grep -q "default-src 'self'" "$NEXT_CONFIG" && ! grep -q "'unsafe-inline'" "$NEXT_CONFIG"; then
      echo -e "    ${YELLOW}!${NC} CSP might be too restrictive for client-side navigation"
      echo -e "      Consider allowing 'unsafe-inline' for style-src or using nonces"
      
      if [ "$AUTO_FIX" = true ]; then
        cp "$NEXT_CONFIG" "${NEXT_CONFIG}.bak"
        sed -i.tmp "s/style-src 'self'/style-src 'self' 'unsafe-inline'/" "$NEXT_CONFIG"
        rm -f "${NEXT_CONFIG}.tmp"
        echo -e "    ${GREEN}✓${NC} Updated CSP to allow inline styles"
      fi
    fi
  else
    echo -e "  ${YELLOW}!${NC} No CSP configuration found"
    echo -e "    This isn't necessarily an issue, but adding CSP headers is recommended for security"
  fi
  
  echo ""
}

# Check the _app.js file for proper configuration
check_app_file() {
  echo -e "${BOLD}5. Checking _app configuration${NC}"
  
  APP_FILE=""
  if file_exists "$PAGES_DIR/_app.js"; then
    APP_FILE="$PAGES_DIR/_app.js"
  elif file_exists "$PAGES_DIR/_app.tsx"; then
    APP_FILE="$PAGES_DIR/_app.tsx"
  elif file_exists "$PAGES_DIR/_app.jsx"; then
    APP_FILE="$PAGES_DIR/_app.jsx"
  fi
  
  if [ -z "$APP_FILE" ]; then
    echo -e "  ${YELLOW}!${NC} No _app file found"
    echo -e "    Creating a custom _app file can help with global layout and navigation"
    
    if [ "$AUTO_FIX" = true ]; then
      echo "import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp" > "$PAGES_DIR/_app.js"
      echo -e "    ${GREEN}✓${NC} Created basic _app.js file"
    fi
  else
    echo -e "  ${GREEN}✓${NC} Found _app file: $APP_FILE"
    
    # Check for router event listeners
    if grep -q "router.events" "$APP_FILE"; then
      echo -e "    ${GREEN}✓${NC} Router event listeners found"
    else
      echo -e "    ${YELLOW}!${NC} No router event listeners found"
      echo -e "      Adding router event listeners can help track and debug navigation issues"
      
      if [ "$AUTO_FIX" = true ]; then
        cp "$APP_FILE" "${APP_FILE}.bak"
        
        if grep -q "import.*next/router" "$APP_FILE"; then
          # Router already imported
          :
        else
          # Add router import
          sed -i.tmp "1s/^/import { useRouter } from 'next\/router'\n/" "$APP_FILE"
        fi
        
        # Add router event listeners
        if grep -q "useEffect" "$APP_FILE"; then
          # There's already a useEffect hook, we need more complex logic
          echo -e "    ${YELLOW}!${NC} Manual update needed for router events"
        else
          # Insert useEffect hook
          sed -i.tmp "/function.*App.*{/a\\
  const router = useRouter()\\
  \\
  useEffect(() => {\\
    const handleRouteChangeStart = (url) => {\\
      console.log(\`Route change starting to \${url}\`)\\
    }\\
    \\
    const handleRouteChangeComplete = (url) => {\\
      console.log(\`Route change completed to \${url}\`)\\
    }\\
    \\
    const handleRouteChangeError = (err, url) => {\\
      console.error(\`Route change to \${url} failed: \${err}\`)\\
    }\\
    \\
    router.events.on('routeChangeStart', handleRouteChangeStart)\\
    router.events.on('routeChangeComplete', handleRouteChangeComplete)\\
    router.events.on('routeChangeError', handleRouteChangeError)\\
    \\
    return () => {\\
      router.events.off('routeChangeStart', handleRouteChangeStart)\\
      router.events.off('routeChangeComplete', handleRouteChangeComplete)\\
      router.events.off('routeChangeError', handleRouteChangeError)\\
    }\\
  }, [])" "$APP_FILE"
          
          # Add React import if missing
          if ! grep -q "import React" "$APP_FILE"; then
            sed -i.tmp "1s/^/import React, { useEffect } from 'react'\n/" "$APP_FILE"
          elif ! grep -q "{ useEffect }" "$APP_FILE"; then
            sed -i.tmp "s/import React/import React, { useEffect }/" "$APP_FILE"
          fi
          
          echo -e "    ${GREEN}✓${NC} Added router event listeners to $APP_FILE"
        fi
        
        rm -f "${APP_FILE}.tmp"
      fi
    fi
  fi
  
  echo ""
}

# Check for issues in emergency route handling
check_emergency_routes() {
  echo -e "${BOLD}6. Checking emergency routes${NC}"
  
  EMERGENCY_DIR="$PAGES_DIR/emergency"
  if ! dir_exists "$EMERGENCY_DIR"; then
    echo -e "  ${YELLOW}!${NC} Emergency directory not found"
    return
  fi
  
  echo -e "  ${GREEN}✓${NC} Found emergency directory"
  
  # Check for incident-response route specifically
  IR_FILE=""
  if dir_exists "$EMERGENCY_DIR/incident-response"; then
    IR_DIR="$EMERGENCY_DIR/incident-response"
    
    if file_exists "$IR_DIR/index.js" || file_exists "$IR_DIR/index.tsx" || file_exists "$IR_DIR/index.jsx"; then
      echo -e "    ${GREEN}✓${NC} Found incident-response index file"
      
      # Check for redirect loops
      for f in "$IR_DIR/index.js" "$IR_DIR/index.tsx" "$IR_DIR/index.jsx"; do
        if file_exists "$f"; then
          IR_FILE="$f"
          break
        fi
      done
      
      if grep -q "router.push" "$IR_FILE" && grep -q "useEffect" "$IR_FILE"; then
        echo -e "    ${YELLOW}!${NC} Potential redirect loop in incident-response"
        
        if [ "$AUTO_FIX" = true ]; then
          # Create backup
          cp "$IR_FILE" "${IR_FILE}.bak"
          
          # Fix the redirect logic
          sed -i.tmp '/useEffect/,/\}/{
            s/useEffect\(.*\){/useEffect\1{/
            s/router.push\((.*)\)/if (router.pathname !== "\/emergency\/incident-response") {\
      router.push\1\
    }/
          }' "$IR_FILE"
          rm -f "${IR_FILE}.tmp"
          echo -e "    ${GREEN}✓${NC} Fixed redirect logic in incident-response"
        fi
      fi
    else
      echo -e "    ${YELLOW}!${NC} No index file found in incident-response directory"
    fi
  else
    echo -e "    ${YELLOW}!${NC} incident-response directory not found"
  fi
  
  # Check for catch-all route handler
  SLUG_FILE=""
  for f in "$EMERGENCY_DIR/[...slug].js" "$EMERGENCY_DIR/[...slug].tsx" "$EMERGENCY_DIR/[...slug].jsx"; do
    if file_exists "$f"; then
      SLUG_FILE="$f"
      break
    fi
  done
  
  if [ -n "$SLUG_FILE" ]; then
    echo -e "    ${GREEN}✓${NC} Found catch-all slug handler: $SLUG_FILE"
    
    # Check for proper slug handling
    if ! grep -q "router.query.slug" "$SLUG_FILE" && ! grep -q "params.slug" "$SLUG_FILE"; then
      echo -e "    ${YELLOW}!${NC} Catch-all slug file may not be handling slugs correctly"
      
      if [ "$AUTO_FIX" = true ]; then
        echo -e "    ${YELLOW}!${NC} Manual review recommended for slug handling logic"
      fi
    fi
  else
    echo -e "    ${YELLOW}!${NC} No catch-all slug handler found"
    echo -e "      This might be needed for handling dynamic emergency routes"
  fi
  
  echo ""
}

# Generate summary and recommendations
generate_summary() {
  echo -e "${BOLD}Summary and Recommendations${NC}"
  echo "--------------------------------"
  
  # Count issues found
  ISSUES=$(grep -c "${YELLOW}!" "$0.log")
  FIXES=$(grep -c "${GREEN}✓ Fixed\|${GREEN}✓ Created\|${GREEN}✓ Added\|${GREEN}✓ Updated" "$0.log")
  
  if [ "$ISSUES" -eq 0 ]; then
    echo -e "${GREEN}No issues found!${NC} Your Next.js routing configuration looks good."
  else
    echo -e "Found ${YELLOW}$ISSUES potential issues${NC} with your Next.js routing configuration."
    
    if [ "$AUTO_FIX" = true ]; then
      echo -e "Applied ${GREEN}$FIXES fixes${NC} automatically."
      
      if [ "$FIXES" -lt "$ISSUES" ]; then
        echo -e "${YELLOW}Some issues require manual intervention.${NC} See the log for details."
      fi
    else
      echo -e "Run with ${BOLD}--fix${NC} to apply automatic fixes for these issues."
    fi
  fi
  
  echo ""
  echo "Review the full output log in $0.log"
  echo ""
  echo -e "${BOLD}Next Steps:${NC}"
  echo "1. Verify any applied fixes"
  echo "2. Test your application routing thoroughly"
  echo "3. Consider implementing the best practices in the routing guide"
  echo ""
}

# Print routing best practices guide
print_routing_guide() {
  echo -e "${BOLD}Next.js Routing Best Practices Guide${NC}"
  echo "-------------------------------------"
  echo -e "See 'routing-guide.md' for comprehensive routing guidelines"
  
  if [ "$AUTO_FIX" = true ]; then
    cat > "routing-guide.md" << 'GUIDE'
# Next.js Routing Best Practices Guide

## Basic Route Structure

1. **File-based routing:**
   - `pages/index.js` → `/`
   - `pages/about.js` → `/about`
   - `pages/blog/index.js` → `/blog`
   - `pages/blog/post.js` → `/blog/post`

2. **Nested routes:**
   - Create directories and files that match your route hierarchy
   - Keep related routes grouped in directories

## Dynamic Routes

1. **Simple dynamic routes:**
   - `pages/posts/[id].js` → `/posts/1`, `/posts/abc`, etc.
   - Access parameters with `useRouter().query.id`

2. **Catch-all routes:**
   - `pages/blog/[...slug].js` → `/blog/2023/01/post`, etc.
   - Access parameters with `useRouter().query.slug` (as array)

3. **Optional catch-all routes:**
   - `pages/[[...slug]].js` → `/`, `/about`, `/about/team`, etc.
   - Matches even if no parameters are provided

## Route Handlers

1. **getStaticProps/getStaticPaths:**
   - Use for content that can be pre-rendered at build time
   - Define which dynamic paths to pre-render with `getStaticPaths`

2. **getServerSideProps:**
   - Use for pages that need server-side rendering on every request
   - Avoid unnecessary server-side rendering when possible

## Internationalization (i18n)

1. **Configuration:**
   ```js
   // next.config.js
   module.exports = {
     i18n: {
       locales: ['en', 'fr', 'it'],
       defaultLocale: 'en',
     }
   }
   ```

2. **Automatic locale detection:**
   - Next.js auto-detects the user's preferred locale
   - Redirects based on the `defaultLocale` setting

3. **Preventing redirect loops:**
   - When pushing to new routes, include the locale:
   ```js
   router.push('/page', '/page', { locale: router.locale })
   ```
   - Or use locale-aware Link component:
   ```jsx
   <Link href="/page" locale={router.locale}>Page</Link>
   ```

## Navigation

1. **Client-side navigation:**
   - Use `<Link>` component for client-side transitions
   - Always include `href` attribute

2. **Programmatic navigation:**
   - Import and use the router: `import { useRouter } from 'next/router'`
   - Navigate with `router.push('/destination')`
   - Pass options like `{ shallow: true }` for partial rendering

3. **Handling route events:**
   ```js
   router.events.on('routeChangeStart', (url) => {
     console.log(`Route changing to ${url}`)
   })
   router.events.on('routeChangeComplete', (url) => {
     console.log(`Route changed to ${url}`)
   })
   router.events.on('routeChangeError', (err, url) => {
     console.error(`Route change to ${url} failed: ${err}`)
   })
   ```

## Common Pitfalls & Solutions

1. **Redirect loops:**
   - Always check current route before redirecting:
   ```js
   useEffect(() => {
     if (router.pathname !== '/desired-path') {
       router.push('/desired-path')
     }
   }, [router])
   ```

2. **Dynamic routes conflicts:**
   - Avoid multiple dynamic route files in the same directory
   - Order matters: more specific routes should come before catch-all routes

3. **404 issues:**
   - Create a custom `pages/404.js` for better user experience
   - Check that your catch-all routes don't accidentally capture invalid routes

4. **Content Security Policy issues:**
   - Ensure script-src allows 'self' and other necessary sources
   - Allow 'unsafe-inline' for style-src if needed for client navigation

5. **i18n issues:**
   - Always include the current locale when navigating:
   ```js
   router.push('/page', undefined, { locale: router.locale })
   ```
   - Test navigation paths with different locales

## Performance Optimization

1. **Code splitting:**
   - Next.js automatically code-splits at the page level
   - Use dynamic imports for additional code splitting within pages

2. **Prefetching:**
   - Links within viewport are automatically prefetched
   - Disable with `<Link prefetch={false}>` when not needed

3. **Shallow routing:**
   - Update URL without running data fetching methods:
   ```js
   router.push('/path?filter=value', undefined, { shallow: true })
   ```
   - Good for updating query parameters without full page reload

## Security Considerations

1. **Input validation:**
   - Always validate dynamic parameters before using them
   - Prevent injection attacks in route parameters

2. **Authentication routing:**
   - Use middleware or HOCs to protect routes
   - Redirect unauthenticated users at the page level

3. **CSP Headers:**
   - Implement strict Content-Security-Policy headers
   - Allow only necessary sources for scripts and styles
GUIDE
    echo -e "${GREEN}✓${NC} Created routing-guide.md with comprehensive guidelines"
  fi
  
  echo ""
}

# Main script execution
(
check_config_files
check_i18n_config
check_dynamic_routes
check_csp_settings
check_app_file
check_emergency_routes
generate_summary
print_routing_guide
) | tee "$0.log"

echo "Diagnostic complete! See $0.log for details."