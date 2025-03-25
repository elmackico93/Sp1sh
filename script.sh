#!/bin/bash
# ==========================================================
# Sp1sh Navigation System Integration Script
# ==========================================================
# This script automates the integration of the enhanced 
# navigation system into the Sp1sh application.
#
# What this script does:
# 1. Updates the Layout component to use EnhancedNavbar
# 2. Adds NavigationProvider to _app.tsx
# 3. Creates common subcategory pages
# 4. Updates imports to ensure menu data accessibility
# 5. Performs necessary file backups before modifications
# ==========================================================

# Text styling
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="."
COMPONENTS_DIR="$PROJECT_ROOT/components"
PAGES_DIR="$PROJECT_ROOT/pages"
CONTEXT_DIR="$PROJECT_ROOT/context"
BACKUPS_DIR="$PROJECT_ROOT/backup-$(date +%Y%m%d%H%M%S)"

# Function to print a section header
print_header() {
    echo -e "\n${BLUE}===========================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================================${NC}"
}

# Function to print a success message
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print an error message
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print a warning message
print_warning() {
    echo -e "${YELLOW}! $1${NC}"
}

# Function to print an info message
print_info() {
    echo -e "${CYAN}i $1${NC}"
}

# Function to back up a file before modifying it
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        # Create backup directory if it doesn't exist
        mkdir -p "$BACKUPS_DIR"
        
        # Get directory structure relative to project root
        local rel_dir=$(dirname "$file" | sed "s|$PROJECT_ROOT/||")
        mkdir -p "$BACKUPS_DIR/$rel_dir"
        
        # Copy file to backup
        cp "$file" "$BACKUPS_DIR/$rel_dir/$(basename "$file")"
        print_info "Backed up $file to $BACKUPS_DIR/$rel_dir/$(basename "$file")"
        return 0
    else
        print_error "File $file does not exist, nothing to back up"
        return 1
    fi
}

# Function to check if the project structure is valid
validate_project_structure() {
    print_header "Validating project structure"
    
    local valid=true
    
    # Check for key directories and files
    if [ ! -d "$COMPONENTS_DIR" ]; then
        print_error "Components directory not found at $COMPONENTS_DIR"
        valid=false
    fi
    
    if [ ! -d "$PAGES_DIR" ]; then
        print_error "Pages directory not found at $PAGES_DIR"
        valid=false
    fi
    
    if [ ! -f "$COMPONENTS_DIR/layout/Layout.tsx" ]; then
        print_error "Layout component not found at $COMPONENTS_DIR/layout/Layout.tsx"
        valid=false
    fi
    
    if [ ! -f "$PAGES_DIR/_app.tsx" ]; then
        print_error "_app.tsx not found at $PAGES_DIR/_app.tsx"
        valid=false
    fi
    
    if [ ! -f "$COMPONENTS_DIR/layout/EnhancedNavbar.tsx" ]; then
        print_error "EnhancedNavbar component not found at $COMPONENTS_DIR/layout/EnhancedNavbar.tsx"
        print_warning "The enhanced navbar component should be created before running this script"
        valid=false
    fi
    
    if [ ! -f "$CONTEXT_DIR/NavigationContext.tsx" ]; then
        print_error "NavigationContext not found at $CONTEXT_DIR/NavigationContext.tsx"
        print_warning "The navigation context should be created before running this script"
        valid=false
    fi
    
    if [ "$valid" = false ]; then
        print_error "Project structure validation failed"
        exit 1
    fi
    
    print_success "Project structure is valid"
}

# Function to update the Layout component
update_layout_component() {
    print_header "Updating Layout component"
    
    local layout_file="$COMPONENTS_DIR/layout/Layout.tsx"
    backup_file "$layout_file"
    
    # Check if the file already imports EnhancedNavbar
    if grep -q "import { EnhancedNavbar } from './EnhancedNavbar'" "$layout_file"; then
        print_info "EnhancedNavbar import already exists in Layout component"
    else
        # Add EnhancedNavbar import
        sed -i "s/import { Header } from '.\/Header';/import { Header } from '.\/Header';\nimport { EnhancedNavbar } from '.\/EnhancedNavbar';/g" "$layout_file"
        print_success "Added EnhancedNavbar import to Layout component"
    fi
    
    # Replace OSNavbar with EnhancedNavbar
    if grep -q "<OSNavbar />" "$layout_file"; then
        sed -i "s/<OSNavbar \/>/<EnhancedNavbar \/>/g" "$layout_file"
        print_success "Replaced OSNavbar with EnhancedNavbar in Layout component"
    elif grep -q "<EnhancedNavbar />" "$layout_file"; then
        print_info "EnhancedNavbar is already in use in Layout component"
    else
        print_warning "Could not find OSNavbar component to replace in Layout"
        print_warning "You may need to manually update the Layout component"
    fi
}

# Function to update _app.tsx to include NavigationProvider
update_app_component() {
    print_header "Updating _app.tsx to include NavigationProvider"
    
    local app_file="$PAGES_DIR/_app.tsx"
    backup_file "$app_file"
    
    # Check if the file already imports NavigationProvider
    if grep -q "import { NavigationProvider } from '../context/NavigationContext'" "$app_file"; then
        print_info "NavigationProvider import already exists in _app.tsx"
    else
        # Add NavigationProvider import
        sed -i "s/import { ScriptsProvider } from '..\/context\/ScriptsContext';/import { ScriptsProvider } from '..\/context\/ScriptsContext';\nimport { NavigationProvider } from '..\/context\/NavigationContext';/g" "$app_file"
        print_success "Added NavigationProvider import to _app.tsx"
    fi
    
    # Wrap content with NavigationProvider
    if grep -q "<NavigationProvider>" "$app_file"; then
        print_info "NavigationProvider is already in use in _app.tsx"
    else
        # Find ScriptsProvider opening tag and add NavigationProvider after it
        sed -i "s/<ScriptsProvider>/<ScriptsProvider>\n          <NavigationProvider>/g" "$app_file"
        
        # Find ScriptsProvider closing tag and add NavigationProvider before it
        sed -i "s/<\/ScriptsProvider>/<\/NavigationProvider>\n          <\/ScriptsProvider>/g" "$app_file"
        
        print_success "Added NavigationProvider wrapper to _app.tsx"
    fi
}

# Function to create common subcategory pages
create_subcategory_pages() {
    print_header "Creating subcategory page templates"
    
    # List of main categories to create pages for
    local categories=(
        "system-admin"
        "security"
        "network"
        "cloud-containers"
        "emergency"
        "devops-cicd"
        "automation"
        "dev-tools"
        "beginners"
    )
    
    # Create pages directory if it doesn't exist
    mkdir -p "$PAGES_DIR/categories"
    
    for category in "${categories[@]}"; do
        local category_dir="$PAGES_DIR/categories/$category"
        mkdir -p "$category_dir"
        
        # Create index.tsx for each category if it doesn't exist
        if [ ! -f "$category_dir/index.tsx" ]; then
            cat > "$category_dir/index.tsx" << EOF
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../../../context/ScriptsContext';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Set current category
    setCurrentCategory('$category');
    
    // Push to dynamic category page
    router.push('/categories/$category');
  }, [setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return null;
}
EOF
            print_success "Created category page for $category"
        else
            print_info "Category page for $category already exists"
        fi
    done
    
    # Create emergency subcategories
    mkdir -p "$PAGES_DIR/emergency/incident-response"
    mkdir -p "$PAGES_DIR/emergency/forensics"
    mkdir -p "$PAGES_DIR/emergency/disaster-recovery"
    
    # Create index.tsx for emergency subcategories
    if [ ! -f "$PAGES_DIR/emergency/incident-response/index.tsx" ]; then
        cat > "$PAGES_DIR/emergency/incident-response/index.tsx" << EOF
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function IncidentResponsePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Route to the dynamic emergency category page
    router.push('/emergency/incident-response');
  }, [router]);

  return <LoadingPlaceholder />;
}
EOF
        print_success "Created emergency/incident-response page"
    fi
    
    if [ ! -f "$PAGES_DIR/emergency/forensics/index.tsx" ]; then
        cat > "$PAGES_DIR/emergency/forensics/index.tsx" << EOF
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function ForensicsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Route to the dynamic emergency category page
    router.push('/emergency/forensics');
  }, [router]);

  return <LoadingPlaceholder />;
}
EOF
        print_success "Created emergency/forensics page"
    fi
    
    if [ ! -f "$PAGES_DIR/emergency/disaster-recovery/index.tsx" ]; then
        cat > "$PAGES_DIR/emergency/disaster-recovery/index.tsx" << EOF
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { LoadingPlaceholder } from '../../../components/ui/LoadingPlaceholder';

export default function DisasterRecoveryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Route to the dynamic emergency category page
    router.push('/emergency/disaster-recovery');
  }, [router]);

  return <LoadingPlaceholder />;
}
EOF
        print_success "Created emergency/disaster-recovery page"
    fi
}

# Function to update EnhancedNavbar to export navigationMenu
update_navigation_exports() {
    print_header "Updating navigation exports"
    
    local navbar_file="$COMPONENTS_DIR/layout/EnhancedNavbar.tsx"
    backup_file "$navbar_file"
    
    # Check if navigationMenu is already exported
    if grep -q "export const navigationMenu" "$navbar_file"; then
        print_info "navigationMenu is already exported from EnhancedNavbar"
    else
        # Replace const navigationMenu with export const navigationMenu
        sed -i "s/const navigationMenu: FirstLevelItem/export const navigationMenu: FirstLevelItem/g" "$navbar_file"
        print_success "Exported navigationMenu from EnhancedNavbar"
    fi
}

# Function to create a dynamic slug handler for emergency pages
create_emergency_slug_handler() {
    print_header "Creating dynamic slug handler for emergency pages"
    
    mkdir -p "$PAGES_DIR/emergency"
    
    local emergency_slug_file="$PAGES_DIR/emergency/[...slug].tsx"
    
    if [ ! -f "$emergency_slug_file" ]; then
        cat > "$emergency_slug_file" << EOF
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { useScripts } from '../../context/ScriptsContext';
import { useNavigation } from '../../context/NavigationContext';
import { ScriptCard } from '../../components/scripts/ScriptCard';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

const EmergencySlugPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { emergencyScripts, isLoading } = useScripts();
  const { getBreadcrumbs } = useNavigation();
  const [pageTitle, setPageTitle] = useState('');
  const [filteredScripts, setFilteredScripts] = useState<any[]>([]);
  
  useEffect(() => {
    if (slug && Array.isArray(slug)) {
      const fullPath = \`/emergency/\${slug.join('/')}\`;
      
      // Set page title based on slug
      const categoryTitle = slug[slug.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setPageTitle(categoryTitle);
      
      // Filter scripts based on the path
      const matchingScripts = emergencyScripts.filter(script => {
        // Match based on title and tags
        return (
          script.title.toLowerCase().includes(categoryTitle.toLowerCase()) ||
          script.tags.some(tag => 
            slug.some(s => tag.toLowerCase().includes(s.toLowerCase()))
          )
        );
      });
      
      setFilteredScripts(matchingScripts);
    }
  }, [slug, emergencyScripts]);
  
  if (isLoading || !slug) {
    return <LoadingPlaceholder />;
  }
  
  const fullPath = \`/emergency/\${Array.isArray(slug) ? slug.join('/') : slug}\`;
  const breadcrumbs = getBreadcrumbs(fullPath);

  return (
    <>
      <Head>
        <title>{pageTitle} Emergency Scripts | Sp1sh</title>
        <meta name="description" content={\`Emergency scripts for \${pageTitle}. Quick solutions for critical situations.\`} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <FiChevronRight className="mx-2 mt-0.5" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 dark:text-white font-medium">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary dark:hover:text-primary-light">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
        
        {/* Category Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {pageTitle} Scripts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Critical scripts for {pageTitle.toLowerCase()} scenarios. These scripts have been verified for reliability and safety.
          </p>
        </div>
        
        {/* Scripts Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Scripts ({filteredScripts.length})
          </h2>
          
          {filteredScripts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No scripts found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No emergency scripts found for this category yet.
              </p>
              <Link
                href="/emergency"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
              >
                Browse All Emergency Scripts
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default EmergencySlugPage;
EOF
        print_success "Created dynamic slug handler for emergency pages"
    else
        print_info "Dynamic slug handler for emergency pages already exists"
    fi
}

# Main execution function
main() {
    print_header "Starting Sp1sh Navigation Integration"
    
    # Validate project structure
    validate_project_structure
    
    # Update Layout component
    update_layout_component
    
    # Update _app.tsx to include NavigationProvider
    update_app_component
    
    # Update EnhancedNavbar to export navigationMenu
    update_navigation_exports
    
    # Create common subcategory pages
    create_subcategory_pages
    
    # Create dynamic slug handler for emergency pages
    create_emergency_slug_handler
    
    print_header "Sp1sh Navigation Integration Complete"
    print_success "The navigation system has been successfully integrated!"
    print_info "Backup files were created in $BACKUPS_DIR"
    print_info "Run 'npm run dev' to test the changes"
    
    echo -e "\n${GREEN}===========================================================${NC}"
    echo -e "${GREEN}Next Steps:${NC}"
    echo -e "${CYAN}1. Review the changes${NC}"
    echo -e "${CYAN}2. Test the navigation flow${NC}"
    echo -e "${CYAN}3. Check for any console errors${NC}"
    echo -e "${CYAN}4. Add additional subcategory pages as needed${NC}"
    echo -e "${GREEN}===========================================================${NC}"
}

# Run the main function
main