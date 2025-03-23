#!/bin/bash
#
# SP1SH PERFORMANCE OPTIMIZER
# ===========================
# Created by the imaginary collaboration of:
# - Linus Torvalds: Kernel and system optimization expertise
# - Bill Gates: Architecture and resource management
# - Kevin Mitnick: Security and performance auditing
#
# This script optimizes the performance of the Sp1sh Next.js application by:
# 1. Implementing code splitting and lazy loading
# 2. Optimizing images for different devices and formats
# 3. Setting up advanced caching strategies
# 4. Configuring selective server-side rendering
# 5. Implementing security measures while maintaining performance

# Set strict error handling as Torvalds would insist
set -euo pipefail
IFS=$'\n\t'

# Define colors for output - Gates likes organized, visual feedback
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;36m"
BOLD="\033[1m"
NC="\033[0m" # No Color

# Log with timestamp - Mitnick's attention to logging details
log() {
    local level=$1
    local message=$2
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    case $level in
        "INFO") 
            echo -e "${BLUE}[INFO]${NC} ${timestamp} - ${message}" ;;
        "SUCCESS") 
            echo -e "${GREEN}[SUCCESS]${NC} ${timestamp} - ${message}" ;;
        "WARNING") 
            echo -e "${YELLOW}[WARNING]${NC} ${timestamp} - ${message}" ;;
        "ERROR") 
            echo -e "${RED}[ERROR]${NC} ${timestamp} - ${message}" ;;
        *)
            echo -e "${timestamp} - ${message}" ;;
    esac
}

# Configuration variables - Gates' approach to centralized configuration
APP_DIR="$(pwd)"
NEXT_CONFIG="${APP_DIR}/next.config.js"
PACKAGE_JSON="${APP_DIR}/package.json"
BACKUP_DIR="${APP_DIR}/.optimization-backups/$(date +%Y%m%d-%H%M%S)"
IMAGE_DIR="${APP_DIR}/public"
COMPONENTS_DIR="${APP_DIR}/components"
PAGES_DIR="${APP_DIR}/pages"

# Security check - Mitnick's security-first mindset
check_permissions() {
    log "INFO" "Performing security checks before optimization..."
    
    # Check if running with appropriate permissions
    if [[ ! -w "${APP_DIR}" ]]; then
        log "ERROR" "Insufficient write permissions to ${APP_DIR}"
        exit 1
    fi
    
    # Check for suspicious modifications (basic integrity check)
    if [[ -f "${APP_DIR}/package.json" ]]; then
        if grep -q "malicious-package" "${APP_DIR}/package.json"; then
            log "ERROR" "Potentially harmful packages detected in package.json"
            exit 1
        fi
    else
        log "ERROR" "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    # Ensure git is clean or has .git directory
    if [[ -d "${APP_DIR}/.git" ]]; then
        if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
            log "WARNING" "Uncommitted changes detected. Consider committing before optimizing."
            read -p "Continue anyway? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log "INFO" "Operation cancelled by user"
                exit 0
            fi
        fi
    else
        log "WARNING" "No Git repository detected. Backups will be created but version control is recommended."
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "INFO" "Operation cancelled by user"
            exit 0
        fi
    fi
    
    log "SUCCESS" "Security checks passed"
}

# Create backups before making changes - Torvalds' insistence on safety
create_backups() {
    log "INFO" "Creating backups before optimization..."
    
    mkdir -p "${BACKUP_DIR}"
    
    # Backup key configuration files
    cp "${NEXT_CONFIG}" "${BACKUP_DIR}/next.config.js.bak" 2>/dev/null || true
    cp "${PACKAGE_JSON}" "${BACKUP_DIR}/package.json.bak" 2>/dev/null || true
    cp "${APP_DIR}/tailwind.config.js" "${BACKUP_DIR}/tailwind.config.js.bak" 2>/dev/null || true
    
    # Create a tarball of the entire project (excluding node_modules and .next)
    tar --exclude="node_modules" --exclude=".next" --exclude=".optimization-backups" \
        -czf "${BACKUP_DIR}/full-backup.tar.gz" -C "${APP_DIR}" .
    
    log "SUCCESS" "Backups created at ${BACKUP_DIR}"
}

# Check for required dependencies - Gates' thoroughness with prerequisites
check_dependencies() {
    log "INFO" "Checking for required dependencies..."
    
    local missing_deps=()
    
    # Check for Node.js and npm
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    # Check for image optimization tools
    if ! command -v convert &> /dev/null; then
        missing_deps+=("imagemagick")
    fi
    
    if ! command -v cwebp &> /dev/null; then
        missing_deps+=("webp")
    fi
    
    # Handle missing dependencies
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log "ERROR" "Missing required dependencies: ${missing_deps[*]}"
        log "INFO" "Please install missing dependencies before continuing."
        
        if [[ " ${missing_deps[*]} " =~ " imagemagick " ]]; then
            echo -e "${YELLOW}Install ImageMagick:${NC}"
            echo "  - Ubuntu/Debian: sudo apt-get install imagemagick"
            echo "  - macOS: brew install imagemagick"
            echo "  - Windows: choco install imagemagick"
        fi
        
        if [[ " ${missing_deps[*]} " =~ " webp " ]]; then
            echo -e "${YELLOW}Install WebP tools:${NC}"
            echo "  - Ubuntu/Debian: sudo apt-get install webp"
            echo "  - macOS: brew install webp"
            echo "  - Windows: choco install webp"
        fi
        
        exit 1
    fi
    
    log "SUCCESS" "All required dependencies are installed"
}

# Implement code splitting and lazy loading - Torvalds' efficiency mindset
implement_code_splitting() {
    log "INFO" "Implementing code splitting and lazy loading..."
    
    # Update next.config.js to enable code splitting
    if [[ -f "${NEXT_CONFIG}" ]]; then
        # Check if code splitting is already configured
        if grep -q "dynamicImport" "${NEXT_CONFIG}"; then
            log "INFO" "Code splitting already configured in next.config.js"
        else
            # Back up the original file
            cp "${NEXT_CONFIG}" "${NEXT_CONFIG}.bak"
            
            # Add experimental features for better code splitting
            cat > "${NEXT_CONFIG}.new" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en',
  },
  webpack: (config, { isServer, dev }) => {
    // Add optimization for production builds
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          components: {
            test: /[\\/]components[\\/]/,
            name: 'components',
            chunks: 'all',
            priority: 8,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://avatars.githubusercontent.com; font-src 'self' data:;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
EOF
            
            mv "${NEXT_CONFIG}.new" "${NEXT_CONFIG}"
            log "SUCCESS" "Updated next.config.js with optimized code splitting configuration"
        fi
    else
        log "ERROR" "next.config.js not found"
        return 1
    fi
    
    # Implement dynamic imports in key components
    implement_dynamic_imports
    
    log "SUCCESS" "Code splitting and lazy loading implemented"
}

# Helper function to implement dynamic imports - Torvalds' modular approach
implement_dynamic_imports() {
    log "INFO" "Implementing dynamic imports for heavy components..."
    
    # Create a dynamic imports utility file
    mkdir -p "${APP_DIR}/utils"
    cat > "${APP_DIR}/utils/dynamicImports.ts" << 'EOF'
import dynamic from 'next/dynamic';

// Dynamic import with loading component
export const dynamicImport = (componentPath: string, loadingComponent: React.ComponentType | null = null) => {
  return dynamic(() => import(componentPath), {
    loading: loadingComponent,
    ssr: true,
  });
};

// Preload a component (can be called before it's needed)
export const preloadComponent = (componentPath: string) => {
  // This triggers the dynamic import but doesn't render the component
  import(componentPath);
};
EOF
    
    # Modify index.tsx to use dynamic imports for heavy components
    if [[ -f "${PAGES_DIR}/index.tsx" ]]; then
        cp "${PAGES_DIR}/index.tsx" "${PAGES_DIR}/index.tsx.bak"
        
        # Create a temporary file with the new imports
        cat > "${PAGES_DIR}/index.tsx.temp" << 'EOF'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useScripts } from '../context/ScriptsContext';
import { Hero } from '../components/home/Hero';
import { EmergencyBanner } from '../components/home/EmergencyBanner';
import { TerminalPreview } from '../components/home/TerminalPreview';
import { dynamicImport } from '../utils/dynamicImports';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';

// Dynamically import heavy components
const EmergencyScripts = dynamicImport('../components/home/EmergencyScripts');
const FeaturedScript = dynamicImport('../components/home/FeaturedScript');
const OSTabs = dynamicImport('../components/home/OSTabs');
const TrendingTable = dynamicImport('../components/home/TrendingTable');
const CategoriesSection = dynamicImport('../components/home/CategoriesSection');
const QuickActions = dynamicImport('../components/home/QuickActions');
const Community = dynamicImport('../components/home/Community');

export default function Home() {
  const { setSearchTerm, isLoading } = useScripts();
  const router = useRouter();
  const { search } = router.query;

  // Preload components when network is idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        import('../components/home/FeaturedScript');
        import('../components/home/OSTabs');
      });
    }
  }, []);

  // Set search term from URL parameter if present
  useEffect(() => {
    if (search && typeof search === 'string') {
      setSearchTerm(search);
    }
  }, [search, setSearchTerm]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <>
      <Hero />
      
      <div className="container mx-auto px-4 mt-6">
        <EmergencyBanner />
        <TerminalPreview />
        <EmergencyScripts />
        <FeaturedScript />
        <OSTabs />
        <TrendingTable />
        <CategoriesSection />
        <QuickActions />
      </div>
      
      <Community />
    </>
  );
});

// Create an offline fallback page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
EOF

    # Update Next.js to use the caching system
    if [[ -f "${PAGES_DIR}/_app.tsx" ]]; then
        cp "${PAGES_DIR}/_app.tsx" "${PAGES_DIR}/_app.tsx.bak"
        
        # Create new _app.tsx with SWR and caching
        cat > "${PAGES_DIR}/_app.tsx.new" << 'EOF'
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';
import { Layout } from '../components/layout/Layout';
import { ScriptsProvider } from '../context/ScriptsContext';
import { cachedFetcher, registerServiceWorker } from '../utils/cache';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // Register service worker for caching
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SWRConfig 
        value={{
          fetcher: cachedFetcher,
          revalidateOnFocus: false,
          revalidateIfStale: true,
          revalidateOnReconnect: true,
          refreshInterval: 0,
          dedupingInterval: 2000,
        }}
      >
        <ScriptsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ScriptsProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
EOF
        
        mv "${PAGES_DIR}/_app.tsx.new" "${PAGES_DIR}/_app.tsx"
        log "SUCCESS" "Updated _app.tsx with caching configuration"
    fi
    
    # Create offline page
    cat > "${PAGES_DIR}/offline.tsx" << 'EOF'
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline - Sp1sh</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            You're Offline
          </h1>
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            It looks like you're currently offline. Some features of Sp1sh require an internet connection.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Don't worry, most scripts and frequently visited pages are available offline.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
EOF
    
    log "SUCCESS" "Created offline page"
    log "SUCCESS" "Advanced caching strategies implemented"
}

# Implement selective server-side rendering - Torvalds' approach to optimizing complex systems
implement_ssr() {
    log "INFO" "Configuring selective server-side rendering..."
    
    # Create a utility for selective SSR
    mkdir -p "${APP_DIR}/utils"
    cat > "${APP_DIR}/utils/renderStrategy.ts" << 'EOF'
import type { GetServerSideProps, GetStaticProps } from 'next';

// Data that changes frequently needs SSR
export const withServerSideRendering = (
  getDataFn?: (context: any) => Promise<any>
): GetServerSideProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error in SSR data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
      };
    }
  };
};

// Static content can use SSG with revalidation
export const withStaticRendering = (
  getDataFn?: (context: any) => Promise<any>,
  revalidateTime: number = 60 * 30 // Default 30 minutes
): GetStaticProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
          revalidate: revalidateTime,
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
        revalidate: revalidateTime,
      };
    } catch (error) {
      console.error('Error in SSG data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
        revalidate: 60, // Retry sooner on error
      };
    }
  };
};

// Hybrid rendering detection (for client-side adaptation)
export const isServerSide = typeof window === 'undefined';

// Performance monitoring for render strategies
export const measureRenderPerformance = () => {
  if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
    const metrics = {
      FCP: 0, // First Contentful Paint
      TTI: 0, // Time to Interactive
      LCP: 0, // Largest Contentful Paint
    };
    
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          console.log(`First Contentful Paint: ${metrics.FCP}ms`);
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.startTime;
      console.log(`Largest Contentful Paint: ${metrics.LCP}ms`);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Time to Interactive approximation
    let timeToInteractive = 0;
    const TTIEstimator = () => {
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      const firstInput = performance.getEntriesByType('first-input')[0];
      
      if (firstInput) {
        timeToInteractive = Math.max(domContentLoaded, firstInput.processingStart);
      } else {
        timeToInteractive = domContentLoaded;
      }
      
      metrics.TTI = timeToInteractive;
      console.log(`Time To Interactive (estimate): ${metrics.TTI}ms`);
    };
    
    window.addEventListener('load', () => {
      // Wait for potential first user interaction
      setTimeout(TTIEstimator, 5000);
    });
    
    return metrics;
  }
  
  return null;
};
EOF
    
    # Update script detail page to use hybrid rendering (SSG + client-side)
    if [[ -f "${PAGES_DIR}/scripts/[id].tsx" ]]; then
        cp "${PAGES_DIR}/scripts/[id].tsx" "${PAGES_DIR}/scripts/[id].tsx.bak"
        
        # Create updated script detail page
        cat > "${PAGES_DIR}/scripts/[id].tsx.new" << 'EOF'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { ScriptDetailHeader } from '../../components/scripts/ScriptDetailHeader';
import { ScriptActions } from '../../components/scripts/ScriptActions';
import { ScriptCode } from '../../components/scripts/ScriptCode';
import { ScriptTags } from '../../components/scripts/ScriptTags';
import { ScriptMetadata } from '../../components/scripts/ScriptMetadata';
import { RelatedScripts } from '../../components/scripts/RelatedScripts';
import { ScriptComments } from '../../components/scripts/ScriptComments';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';
import { withStaticRendering } from '../../utils/renderStrategy';
import { getScriptById as getScriptByIdUtil, mockScripts } from '../../mocks/scripts';

// Props interface for the page
interface ScriptDetailProps {
  initialScript: any;
  renderedAt: string;
}

export default function ScriptDetail({ initialScript, renderedAt }: ScriptDetailProps) {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  const [script, setScript] = useState(initialScript);
  
  // If we get initial script from static props, use it
  // Otherwise fall back to client-side loading
  useEffect(() => {
    // If we have id but no script, try to load it client-side
    if (id && typeof id === 'string' && !script) {
      const scriptData = getScriptById(id);
      if (scriptData) {
        setScript(scriptData);
      }
    }
  }, [id, getScriptById, script]);
  
  // Get related scripts based on tags and category
  const relatedScripts = script
    ? allScripts
        .filter(s => 
          s.id !== script.id && 
          (s.category === script.category || 
           s.tags.some(tag => script.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];
  
  // Initialize syntax highlighting
  useEffect(() => {
    if (codeRef.current && script) {
      Prism.highlightElement(codeRef.current);
    }
  }, [script]);

  // Handle back button
  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      // If no history, go to homepage
      router.push('/');
    }
  };

  // Determine loading state by combining SSR data and client state
  const isPageLoading = isLoading || (typeof id === 'string' && !script);

  if (isPageLoading) {
    return <LoadingPlaceholder />;
  }

  if (!script) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Script not found</h1>
        <p className="mb-6">The script you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <Layout title={`${script.title} | Sp1sh`} description={script.description}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScriptDetailHeader script={script} />
            <ScriptActions script={script} />
            <ScriptCode script={script} codeRef={codeRef} />
            <ScriptTags tags={script.tags} />
            <ScriptComments />
          </div>
          
          <div className="lg:col-span-1">
            <ScriptMetadata script={script} />
            <RelatedScripts scripts={relatedScripts} />
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-500 rounded">
                Rendered at: {new Date(renderedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Get static paths for commonly accessed scripts
export async function getStaticPaths() {
  // Identify the top scripts (e.g., most popular, critical ones)
  const topScriptIds = mockScripts
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map(script => script.id);
  
  const paths = topScriptIds.map(id => ({
    params: { id },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Show a loading state for paths not pre-rendered
  };
}

// Use static props with revalidation for script details
export const getStaticProps = withStaticRendering(async (context) => {
  const { id } = context.params as { id: string };
  const script = getScriptByIdUtil(id);
  
  if (!script) {
    return {
      notFound: true, // Will show 404 page
    };
  }
  
  return {
    initialScript: script,
  };
}, 60 * 60); // Revalidate every hour
EOF
        
        mv "${PAGES_DIR}/scripts/[id].tsx.new" "${PAGES_DIR}/scripts/[id].tsx"
        log "SUCCESS" "Updated script detail page with hybrid rendering"
    fi
    
    # Create a rendering performance report component
    cat > "${COMPONENTS_DIR}/ui/PerformanceReport.tsx" << 'EOF'
import React, { useEffect, useState } from 'react';
import { measureRenderPerformance } from '../../utils/renderStrategy';

interface PerformanceMetrics {
  FCP: number;
  TTI: number;
  LCP: number;
}

interface PerformanceReportProps {
  showInProduction?: boolean;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({ 
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only show in development or if explicitly allowed in production
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    if (!isDevEnvironment && !showInProduction) {
      return;
    }
    
    // Start measuring performance
    const performanceMetrics = measureRenderPerformance();
    
    // Wait for metrics to be collected
    const timer = setTimeout(() => {
      setMetrics(performanceMetrics);
      setVisible(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [showInProduction]);
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 text-xs z-50 opacity-80 hover:opacity-100 transition-opacity">
      <h4 className="font-bold mb-2 flex justify-between items-center">
        <span>Performance Metrics</span>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </h4>
      {metrics ? (
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>First Contentful Paint:</span>
            <span className={`font-mono ${metrics.FCP < 1000 ? 'text-green-500' : metrics.FCP < 2500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.FCP.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Time to Interactive:</span>
            <span className={`font-mono ${metrics.TTI < 3500 ? 'text-green-500' : metrics.TTI < 7500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.TTI.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Largest Contentful Paint:</span>
            <span className={`font-mono ${metrics.LCP < 2500 ? 'text-green-500' : metrics.LCP < 4000 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.LCP.toFixed(1)} ms
            </span>
          </li>
        </ul>
      ) : (
        <p>Collecting metrics...</p>
      )}
    </div>
  );
};

export default PerformanceReport;
EOF
    
    log "SUCCESS" "Created performance monitoring component"
    log "SUCCESS" "Selective SSR configuration complete"
}

# Run all optimization steps
run_all_optimizations() {
    echo -e "\n${BOLD}SP1SH PERFORMANCE OPTIMIZER${NC}"
    echo -e "${BOLD}============================${NC}\n"
    
    # Run security checks first
    check_permissions
    
    # Make sure we have the required dependencies
    check_dependencies
    
    # Create backups
    create_backups
    
    # Run all optimizations
    implement_code_splitting
    optimize_images
    setup_caching
    implement_ssr
    
    log "SUCCESS" "🎉 All optimizations have been successfully applied"
    
    # Provide recommended next steps
    cat << EOF

${BOLD}RECOMMENDED NEXT STEPS:${NC}
1. Run '${YELLOW}npm run build${NC}' to apply the optimizations
2. Test the application with '${YELLOW}npm run start${NC}'
3. Verify the performance improvements using browser developer tools

${BOLD}PERFORMANCE MONITORING:${NC}
- The PerformanceReport component can be added to any page for detailed metrics
- Check the console for performance data during development
- Use 'chrome://inspect/#service-workers' to inspect the service worker

${BOLD}BACKUP LOCATION:${NC}
All original files have been backed up to ${BACKUP_DIR}

For any issues, you can restore from backups or revert to the previous version.
EOF
}

# Execute all optimizations
run_all_optimizations

exit 0
}
EOF
        
        # Only replace the file if the modifications are different
        if ! cmp -s "${PAGES_DIR}/index.tsx.temp" "${PAGES_DIR}/index.tsx"; then
            mv "${PAGES_DIR}/index.tsx.temp" "${PAGES_DIR}/index.tsx"
            log "SUCCESS" "Updated index.tsx with dynamic imports"
        else
            rm "${PAGES_DIR}/index.tsx.temp"
            log "INFO" "index.tsx already has optimized imports"
        fi
    fi
    
    # Create a global loading state component for better UX
    mkdir -p "${COMPONENTS_DIR}/ui"
    cat > "${COMPONENTS_DIR}/ui/ComponentLoading.tsx" << 'EOF'
import React from 'react';

interface ComponentLoadingProps {
  height?: string;
}

export const ComponentLoading: React.FC<ComponentLoadingProps> = ({ height = '12rem' }) => {
  return (
    <div 
      className="w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
      style={{ height }}
    >
      <div className="flex items-center justify-center h-full">
        <svg className="w-8 h-8 text-gray-300 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
    </div>
  );
};

export default ComponentLoading;
EOF
    
    log "SUCCESS" "Dynamic imports utility created"
}

# Optimize images - Gates' focus on resource efficiency
optimize_images() {
    log "INFO" "Optimizing images for different devices and formats..."
    
    # Check if the image directory exists
    if [[ ! -d "${IMAGE_DIR}" ]]; then
        log "WARNING" "Public directory not found at ${IMAGE_DIR}"
        return 1
    fi
    
    # Create directories for optimized images
    mkdir -p "${IMAGE_DIR}/optimized"
    mkdir -p "${IMAGE_DIR}/optimized/webp"
    mkdir -p "${IMAGE_DIR}/optimized/avif"
    
    # Find all images in the public directory
    log "INFO" "Scanning for images to optimize..."
    image_count=0
    
    find "${IMAGE_DIR}" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -not -path "*/optimized/*" -not -path "*/node_modules/*" | while read -r img; do
        filename=$(basename "${img}")
        name="${filename%.*}"
        extension="${filename##*.}"
        
        log "INFO" "Optimizing: ${filename}"
        
        # Create responsive versions (sm, md, lg, xl)
        convert "${img}" -resize 640x -quality 80 "${IMAGE_DIR}/optimized/${name}-sm.${extension}"
        convert "${img}" -resize 1024x -quality 80 "${IMAGE_DIR}/optimized/${name}-md.${extension}"
        convert "${img}" -resize 1920x -quality 80 "${IMAGE_DIR}/optimized/${name}-xl.${extension}"
        
        # Create WebP versions
        cwebp -q 80 "${IMAGE_DIR}/optimized/${name}-sm.${extension}" -o "${IMAGE_DIR}/optimized/webp/${name}-sm.webp"
        cwebp -q 80 "${IMAGE_DIR}/optimized/${name}-md.${extension}" -o "${IMAGE_DIR}/optimized/webp/${name}-md.webp"
        cwebp -q 80 "${IMAGE_DIR}/optimized/${name}-xl.${extension}" -o "${IMAGE_DIR}/optimized/webp/${name}-xl.webp"
        
        # Try to create AVIF versions if avifenc is available
        if command -v avifenc &> /dev/null; then
            avifenc --min 0 --max 63 --speed 6 -a end-usage=q -a cq-level=40 \
                "${IMAGE_DIR}/optimized/${name}-sm.${extension}" \
                "${IMAGE_DIR}/optimized/avif/${name}-sm.avif"
            
            avifenc --min 0 --max 63 --speed 6 -a end-usage=q -a cq-level=40 \
                "${IMAGE_DIR}/optimized/${name}-md.${extension}" \
                "${IMAGE_DIR}/optimized/avif/${name}-md.avif"
            
            avifenc --min 0 --max 63 --speed 6 -a end-usage=q -a cq-level=40 \
                "${IMAGE_DIR}/optimized/${name}-xl.${extension}" \
                "${IMAGE_DIR}/optimized/avif/${name}-xl.avif"
        else
            log "WARNING" "avifenc not found, skipping AVIF generation"
        fi
        
        ((image_count++))
    done
    
    # Create an image component that uses modern formats with fallbacks
    cat > "${COMPONENTS_DIR}/ui/OptimizedImage.tsx" << 'EOF'
import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  loading = 'lazy'
}) => {
  // Get the base filename without extension
  const getBaseFilename = (path: string) => {
    // Extract filename from path
    const filename = path.split('/').pop() || '';
    // Remove extension
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  };
  
  // Determine if this is a local image or external URL
  const isExternalImage = src.startsWith('http') || src.startsWith('//');
  
  // For local images, use optimized versions
  if (!isExternalImage) {
    const basePath = '/optimized';
    const baseName = getBaseFilename(src);
    const originalExt = src.substring(src.lastIndexOf('.') + 1);
    
    // Determine appropriate size suffix based on width
    let sizeSuffix = '-xl';
    if (width && width <= 640) sizeSuffix = '-sm';
    else if (width && width <= 1024) sizeSuffix = '-md';
    
    return (
      <picture>
        {/* AVIF format */}
        <source
          srcSet={`${basePath}/avif/${baseName}${sizeSuffix}.avif`}
          type="image/avif"
        />
        {/* WebP format */}
        <source
          srcSet={`${basePath}/webp/${baseName}${sizeSuffix}.webp`}
          type="image/webp"
        />
        {/* Original format as fallback */}
        <Image
          src={`${basePath}/${baseName}${sizeSuffix}.${originalExt}`}
          alt={alt}
          width={width}
          height={height}
          className={className}
          sizes={sizes}
          priority={priority}
          loading={loading}
        />
      </picture>
    );
  }
  
  // For external images, just use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={loading}
    />
  );
};

export default OptimizedImage;
EOF
    
    log "SUCCESS" "Created optimized image component at ${COMPONENTS_DIR}/ui/OptimizedImage.tsx"
    log "SUCCESS" "Optimized ${image_count} images"
}

# Set up advanced caching - Mitnick's expertise in resource access optimization
setup_caching() {
    log "INFO" "Setting up advanced caching strategies..."
    
    # Create a caching utility
    mkdir -p "${APP_DIR}/utils"
    cat > "${APP_DIR}/utils/cache.ts" << 'EOF'
/**
 * Advanced caching utilities for Sp1sh
 */

// In-memory cache store
const MEMORY_CACHE: Record<string, { data: any; expiry: number }> = {};

// Browser storage based cache
export const storageCache = {
  // Set item with expiration
  set: (key: string, data: any, ttlSeconds: number = 3600): void => {
    try {
      const expiry = Date.now() + (ttlSeconds * 1000);
      const item = { data, expiry };
      localStorage.setItem(`sp1sh_cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  },
  
  // Get item and check expiration
  get: <T>(key: string): T | null => {
    try {
      const cachedItem = localStorage.getItem(`sp1sh_cache_${key}`);
      if (!cachedItem) return null;
      
      const item = JSON.parse(cachedItem);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(`sp1sh_cache_${key}`);
        return null;
      }
      
      return item.data as T;
    } catch (error) {
      console.error('Error getting cached item:', error);
      return null;
    }
  },
  
  // Remove item
  remove: (key: string): void => {
    localStorage.removeItem(`sp1sh_cache_${key}`);
  },
  
  // Clear all cache
  clear: (): void => {
    // Only clear sp1sh_cache_ prefixed items
    Object.keys(localStorage)
      .filter(key => key.startsWith('sp1sh_cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

// Memory cache for faster access
export const memoryCache = {
  // Set item with expiration
  set: <T>(key: string, data: T, ttlSeconds: number = 60): void => {
    const expiry = Date.now() + (ttlSeconds * 1000);
    MEMORY_CACHE[key] = { data, expiry };
  },
  
  // Get item and check expiration
  get: <T>(key: string): T | null => {
    const cachedItem = MEMORY_CACHE[key];
    if (!cachedItem) return null;
    
    if (Date.now() > cachedItem.expiry) {
      delete MEMORY_CACHE[key];
      return null;
    }
    
    return cachedItem.data as T;
  },
  
  // Remove item
  remove: (key: string): void => {
    delete MEMORY_CACHE[key];
  },
  
  // Clear all cache
  clear: (): void => {
    Object.keys(MEMORY_CACHE).forEach(key => {
      delete MEMORY_CACHE[key];
    });
  }
};

// SWR fetcher with cache
export const cachedFetcher = async <T>(
  url: string, 
  options?: RequestInit, 
  ttlSeconds: number = 3600
): Promise<T> => {
  const cacheKey = `fetch_${url}_${JSON.stringify(options || {})}`;
  
  // Try memory cache first (fastest)
  const memCachedData = memoryCache.get<T>(cacheKey);
  if (memCachedData) return memCachedData;
  
  // Try storage cache next
  const storageCachedData = storageCache.get<T>(cacheKey);
  if (storageCachedData) {
    // Refresh memory cache
    memoryCache.set(cacheKey, storageCachedData, 60);
    return storageCachedData;
  }
  
  // Fetch fresh data
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the fresh data
  memoryCache.set(cacheKey, data, 60); // Short TTL for memory
  storageCache.set(cacheKey, data, ttlSeconds); // Longer TTL for storage
  
  return data as T;
};

// Service worker registration for additional caching
export const registerServiceWorker = (): void => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
};
EOF
    
    # Create a modern service worker with advanced caching
    cat > "${APP_DIR}/public/sw.js" << 'EOF'
// Sp1sh Advanced Service Worker
// Combines the expertise of caching strategies by Kevin Mitnick, Bill Gates, and Linus Torvalds

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `sp1sh-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sp1sh-runtime-${CACHE_VERSION}`;
const STATIC_CACHE = `sp1sh-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `sp1sh-images-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/favicon.ico',
  '/site.webmanifest',
  '/scripts/script-1', // Popular routes pre-cached
  '/emergency'
];

// Static assets that rarely change
const STATIC_ASSETS = [
  '/fonts/',
  '/optimized/'
];

// Helper function to determine request types
const isImage = (url) => /\.(jpe?g|png|gif|svg|webp|avif)$/i.test(new URL(url).pathname);
const isStaticAsset = (url) => {
  const { pathname } = new URL(url);
  return STATIC_ASSETS.some(asset => pathname.startsWith(asset));
};
const isApiRequest = (url) => new URL(url).pathname.startsWith('/api/');
const isHtmlRequest = (url) => {
  const { pathname } = new URL(url);
  return !pathname.match(/\.[a-z]{2,4}$/i) || pathname.endsWith('.html');
};

// Install event - precache important assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(PRECACHE_ASSETS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, STATIC_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement advanced strategies based on resource type
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Strategy 1: Network-first for API requests (most fresh data)
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache for offline functionality
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Strategy 2: Cache-first for static assets (faster loading)
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response immediately
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then((response) => {
              if (!response.ok) return response;
              
              // Cache the fetched response
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            });
        })
    );
    return;
  }
  
  // Strategy 3: Special strategy for images (long cache, stale-while-revalidate)
  if (isImage(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Start network fetch
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Update cache with fresh image
              caches.open(IMAGE_CACHE)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
                
              return networkResponse;
            })
            .catch(() => {
              // If network fetch fails, return cached response
              // or null if no cached response (will be handled later)
              return cachedResponse;
            });
            
          // Return cached response immediately if exists
          // otherwise wait for network response
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Strategy 4: Network-first with fallback for HTML pages
  if (isHtmlRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, clonedResponse);
            });
            
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If no cached version, show offline page
              return caches.match('/offline');
            });
        })
    );
    return;
  }
  
  // Strategy 5: Stale-while-revalidate for all other requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Start fetch from network in background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
              
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return cached response or error
            return cachedResponse || new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
          
        // Return cached response immediately if exists
        // otherwise wait for network response
        return cachedResponse || fetchPromise;
      })
 );
});

# Register event handler for messages from client
self.addEventListener('message', (event) => {
  // Handle skip waiting message to activate updated service worker immediately
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clear requests
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log("All caches cleared");
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
    );
  }
});

// Optional cache cleanup function - remove old/expired items
const cleanupCache = async () => {
  const now = Date.now();
  const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    // Skip the static cache - these assets should persist
    if (cacheName === STATIC_CACHE) continue;
    
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (!response) continue;
      
      // Check if the cached response has a date header
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const cacheTime = new Date(dateHeader).getTime();
        if (now - cacheTime > MAX_AGE) {
          // Remove items older than MAX_AGE
          cache.delete(request);
        }
      }
    }
  }
};

// Set up periodic cache cleanup when available
if ('periodicSync' in self.registration) {
  self.registration.periodicSync.register('cache-cleanup', {
    minInterval: 24 * 60 * 60 * 1000 // Once per day
  }).catch(err => {
    console.error('Failed to register periodic sync:', err);
  });
  
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-cleanup') {
      event.waitUntil(cleanupCache());
    }
  });
}
EOF

    # Create an app manifest for PWA capabilities
    cat > "${APP_DIR}/public/site.webmanifest" << 'EOF'
{
  "name": "Sp1sh - Shell Script Repository",
  "short_name": "Sp1sh",
  "description": "Find and use expert-curated shell scripts for Linux, Windows, and macOS",
  "categories": ["productivity", "utilities", "developer tools"],
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0070e0"
}
EOF

    # Create offline fallback page
    cat > "${PAGES_DIR}/offline.tsx" << 'EOF'
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline - Sp1sh</title>
        <meta name="description" content="You are currently offline" />
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            You're Offline
          </h1>
          <div className="text-6xl mb-4">🔌</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            It looks like you're currently offline. Some features of Sp1sh require an internet connection.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Don't worry, most scripts and frequently visited pages are available offline.
          </p>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
            Try again
          </Link>
        </div>
      </div>
    </>
  );
}
EOF

    log "SUCCESS" "Created offline fallback page"
    log "SUCCESS" "Advanced caching strategies implemented"
}

# Implement selective server-side rendering - Torvalds' approach to optimizing complex systems
implement_ssr() {
    log "INFO" "Configuring selective server-side rendering..."
    
    # Create a utility for selective SSR
    mkdir -p "${APP_DIR}/utils"
    cat > "${APP_DIR}/utils/renderStrategy.ts" << 'EOF'
/**
 * Advanced rendering strategy utilities for Sp1sh
 */

import type { GetServerSideProps, GetStaticProps } from 'next';

// Data that changes frequently needs SSR
export const withServerSideRendering = (
  getDataFn?: (context: any) => Promise<any>
): GetServerSideProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error in SSR data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
      };
    }
  };
};

// Static content can use SSG with revalidation
export const withStaticRendering = (
  getDataFn?: (context: any) => Promise<any>,
  revalidateTime: number = 60 * 30 // Default 30 minutes
): GetStaticProps => {
  return async (context) => {
    try {
      // If data fetching function provided, use it
      if (getDataFn) {
        const data = await getDataFn(context);
        return {
          props: {
            ...data,
            renderedAt: new Date().toISOString(),
          },
          revalidate: revalidateTime,
        };
      }
      
      // Default minimal props
      return {
        props: {
          renderedAt: new Date().toISOString(),
        },
        revalidate: revalidateTime,
      };
    } catch (error) {
      console.error('Error in SSG data fetching:', error);
      return {
        props: {
          error: 'Failed to load data',
          renderedAt: new Date().toISOString(),
        },
        revalidate: 60, // Retry sooner on error
      };
    }
  };
};

// Hybrid rendering detection (for client-side adaptation)
export const isServerSide = typeof window === 'undefined';

// Performance monitoring for render strategies
export const measureRenderPerformance = () => {
  if (typeof window !== 'undefined' && typeof performance !== 'undefined') {
    const metrics = {
      FCP: 0, // First Contentful Paint
      TTI: 0, // Time to Interactive
      LCP: 0, // Largest Contentful Paint
    };
    
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          console.log(`First Contentful Paint: ${metrics.FCP}ms`);
        }
      }
    });
    paintObserver.observe({ type: 'paint', buffered: true });
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.startTime;
      console.log(`Largest Contentful Paint: ${metrics.LCP}ms`);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // Time to Interactive approximation
    let timeToInteractive = 0;
    const TTIEstimator = () => {
      const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      const firstInput = performance.getEntriesByType('first-input')[0];
      
      if (firstInput) {
        timeToInteractive = Math.max(domContentLoaded, firstInput.processingStart);
      } else {
        timeToInteractive = domContentLoaded;
      }
      
      metrics.TTI = timeToInteractive;
      console.log(`Time To Interactive (estimate): ${metrics.TTI}ms`);
    };
    
    window.addEventListener('load', () => {
      // Wait for potential first user interaction
      setTimeout(TTIEstimator, 5000);
    });
    
    return metrics;
  }
  
  return null;
};
EOF
    
    # Update script detail page to use hybrid rendering (SSG + client-side)
    if [[ -f "${PAGES_DIR}/scripts/[id].tsx" ]]; then
        cp "${PAGES_DIR}/scripts/[id].tsx" "${PAGES_DIR}/scripts/[id].tsx.bak"
        
        # Create updated script detail page
        cat > "${PAGES_DIR}/scripts/[id].tsx.new" << 'EOF'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { ScriptDetailHeader } from '../../components/scripts/ScriptDetailHeader';
import { ScriptActions } from '../../components/scripts/ScriptActions';
import { ScriptCode } from '../../components/scripts/ScriptCode';
import { ScriptTags } from '../../components/scripts/ScriptTags';
import { ScriptMetadata } from '../../components/scripts/ScriptMetadata';
import { RelatedScripts } from '../../components/scripts/RelatedScripts';
import { ScriptComments } from '../../components/scripts/ScriptComments';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';
import { withStaticRendering } from '../../utils/renderStrategy';
import { getScriptById as getScriptByIdUtil, mockScripts } from '../../mocks/scripts';

// Props interface for the page
interface ScriptDetailProps {
  initialScript: any;
  renderedAt: string;
}

export default function ScriptDetail({ initialScript, renderedAt }: ScriptDetailProps) {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  const [script, setScript] = useState(initialScript);
  
  // If we get initial script from static props, use it
  // Otherwise fall back to client-side loading
  useEffect(() => {
    // If we have id but no script, try to load it client-side
    if (id && typeof id === 'string' && !script) {
      const scriptData = getScriptById(id);
      if (scriptData) {
        setScript(scriptData);
      }
    }
  }, [id, getScriptById, script]);
  
  // Get related scripts based on tags and category
  const relatedScripts = script
    ? allScripts
        .filter(s => 
          s.id !== script.id && 
          (s.category === script.category || 
           s.tags.some(tag => script.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];
  
  // Initialize syntax highlighting
  useEffect(() => {
    if (codeRef.current && script) {
      Prism.highlightElement(codeRef.current);
    }
  }, [script]);

  // Handle back button
  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      // If no history, go to homepage
      router.push('/');
    }
  };

  // Determine loading state by combining SSR data and client state
  const isPageLoading = isLoading || (typeof id === 'string' && !script);

  if (isPageLoading) {
    return <LoadingPlaceholder />;
  }

  if (!script) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Script not found</h1>
        <p className="mb-6">The script you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-full"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <Layout title={`${script.title} | Sp1sh`} description={script.description}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScriptDetailHeader script={script} />
            <ScriptActions script={script} />
            <ScriptCode script={script} codeRef={codeRef} />
            <ScriptTags tags={script.tags} />
            <ScriptComments />
          </div>
          
          <div className="lg:col-span-1">
            <ScriptMetadata script={script} />
            <RelatedScripts scripts={relatedScripts} />
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-500 rounded">
                Rendered at: {new Date(renderedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Get static paths for commonly accessed scripts
export async function getStaticPaths() {
  // Identify the top scripts (e.g., most popular, critical ones)
  const topScriptIds = mockScripts
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map(script => script.id);
  
  const paths = topScriptIds.map(id => ({
    params: { id },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Show a loading state for paths not pre-rendered
  };
}

// Use static props with revalidation for script details
export const getStaticProps = withStaticRendering(async (context) => {
  const { id } = context.params as { id: string };
  const script = getScriptByIdUtil(id);
  
  if (!script) {
    return {
      notFound: true, // Will show 404 page
    };
  }
  
  return {
    initialScript: script,
  };
}, 60 * 60); // Revalidate every hour
EOF
        
        mv "${PAGES_DIR}/scripts/[id].tsx.new" "${PAGES_DIR}/scripts/[id].tsx"
        log "SUCCESS" "Updated script detail page with hybrid rendering"
    fi
    
    # Create a rendering performance report component
    mkdir -p "${COMPONENTS_DIR}/ui"
    cat > "${COMPONENTS_DIR}/ui/PerformanceReport.tsx" << 'EOF'
import React, { useEffect, useState } from 'react';
import { measureRenderPerformance } from '../../utils/renderStrategy';

interface PerformanceMetrics {
  FCP: number;
  TTI: number;
  LCP: number;
}

interface PerformanceReportProps {
  showInProduction?: boolean;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({ 
  showInProduction = false 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only show in development or if explicitly allowed in production
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    if (!isDevEnvironment && !showInProduction) {
      return;
    }
    
    // Start measuring performance
    const performanceMetrics = measureRenderPerformance();
    
    // Wait for metrics to be collected
    const timer = setTimeout(() => {
      setMetrics(performanceMetrics);
      setVisible(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [showInProduction]);
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 text-xs z-50 opacity-80 hover:opacity-100 transition-opacity">
      <h4 className="font-bold mb-2 flex justify-between items-center">
        <span>Performance Metrics</span>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </h4>
      {metrics ? (
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>First Contentful Paint:</span>
            <span className={`font-mono ${metrics.FCP < 1000 ? 'text-green-500' : metrics.FCP < 2500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.FCP.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Time to Interactive:</span>
            <span className={`font-mono ${metrics.TTI < 3500 ? 'text-green-500' : metrics.TTI < 7500 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.TTI.toFixed(1)} ms
            </span>
          </li>
          <li className="flex justify-between">
            <span>Largest Contentful Paint:</span>
            <span className={`font-mono ${metrics.LCP < 2500 ? 'text-green-500' : metrics.LCP < 4000 ? 'text-yellow-500' : 'text-red-500'}`}>
              {metrics.LCP.toFixed(1)} ms
            </span>
          </li>
        </ul>
      ) : (
        <p>Collecting metrics...</p>
      )}
    </div>
  );
};

export default PerformanceReport;
EOF
    
    log "SUCCESS" "Created performance monitoring component"
    
    # Create a helper to enhance your app with performance monitoring in development mode
    cat > "${APP_DIR}/utils/performanceMonitoring.ts" << 'EOF'
/**
 * Performance Monitoring Utils for Development
 */

// Helper to detect slow renders
export const detectSlowRenders = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  if (typeof window !== 'undefined') {
    // Detect slow renders in React components
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Slow render')) {
        console.trace('Slow render detected:');
      }
      originalConsoleWarn.apply(console, args);
    };
    
    // Log navigation performance
    const logNavigationPerformance = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        console.log('Navigation Performance:');
        console.log(`- DNS lookup: ${navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart}ms`);
        console.log(`- Connection: ${navigationEntry.connectEnd - navigationEntry.connectStart}ms`);
        console.log(`- Response time: ${navigationEntry.responseEnd - navigationEntry.responseStart}ms`);
        console.log(`- DOM Content Loaded: ${navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart}ms`);
        console.log(`- Load event: ${navigationEntry.loadEventEnd - navigationEntry.loadEventStart}ms`);
      }
    };
    
    window.addEventListener('load', () => {
      setTimeout(logNavigationPerformance, 0);
    });
  }
};

// Get all resource timings for performance analysis
export const getResourceTimings = () => {
  if (typeof window === 'undefined') return [];
  
  return performance.getEntriesByType('resource').map(entry => {
    // Cast to ResourceTiming to access resource-specific properties
    const resource = entry as PerformanceResourceTiming;
    return {
      name: resource.name,
      initiatorType: resource.initiatorType,
      startTime: resource.startTime,
      duration: resource.duration,
      transferSize: resource.transferSize,
      decodedBodySize: resource.decodedBodySize,
    };
  });
};

// Helper to identify render-blocking resources
export const identifyRenderBlockingResources = () => {
  if (typeof window === 'undefined') return [];
  
  const blockers = [];
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const navigationStart = performance.timing.navigationStart;
  const firstPaint = performance.getEntriesByType('paint')
    .find(entry => entry.name === 'first-paint')?.startTime || 0;
  
  for (const resource of resources) {
    // Resources that finished loading after first paint and started before it
    // are potentially render blocking
    if (resource.startTime < firstPaint && resource.responseEnd > firstPaint) {
      blockers.push({
        url: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize,
      });
    }
  }
  
  return blockers;
};
EOF

    log "SUCCESS" "Created performance monitoring utilities"
    log "SUCCESS" "Selective SSR configuration complete"
    
    # Add performance monitoring to _app.tsx
    if [[ -f "${PAGES_DIR}/_app.tsx" ]]; then
        cp "${PAGES_DIR}/_app.tsx" "${PAGES_DIR}/_app.tsx.bak"
        
        # Create a temporary file for the new _app.tsx content
        cat > "${PAGES_DIR}/_app.tsx.temp" << 'EOF'
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';
import { Layout } from '../components/layout/Layout';
import { ScriptsProvider } from '../context/ScriptsContext';
import { cachedFetcher, registerServiceWorker } from '../utils/cache';
import { detectSlowRenders } from '../utils/performanceMonitoring';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PerformanceReport } from '../components/ui/PerformanceReport';

export default function App({ Component, pageProps }: AppProps) {
  // Register service worker for caching
  useEffect(() => {
    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      detectSlowRenders();
    }
    
    // Register service worker in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SWRConfig 
        value={{
          fetcher: cachedFetcher,
          revalidateOnFocus: false,
          revalidateIfStale: true,
          revalidateOnReconnect: true,
          refreshInterval: 0,
          dedupingInterval: 2000,
        }}
      >
        <ScriptsProvider>
          <Layout>
            <Component {...pageProps} />
            {process.env.NODE_ENV === 'development' && <PerformanceReport />}
          </Layout>
        </ScriptsProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
EOF
        
        # Check if file has changed before replacing
        if ! cmp -s "${PAGES_DIR}/_app.tsx.temp" "${PAGES_DIR}/_app.tsx"; then
            mv "${PAGES_DIR}/_app.tsx.temp" "${PAGES_DIR}/_app.tsx"
            log "SUCCESS" "Updated _app.tsx with performance monitoring"
        else
            rm "${PAGES_DIR}/_app.tsx.temp"
            log "INFO" "_app.tsx already optimized"
        fi
    fi
}

# Function to verify optimizations were applied correctly
verify_optimizations() {
    log "INFO" "Verifying optimizations..."
    
    # Array of critical files to check
    local CRITICAL_FILES=(
        "${NEXT_CONFIG}"
        "${APP_DIR}/utils/dynamicImports.ts"
        "${APP_DIR}/utils/cache.ts"
        "${APP_DIR}/utils/renderStrategy.ts"
        "${APP_DIR}/public/sw.js"
        "${COMPONENTS_DIR}/ui/OptimizedImage.tsx"
        "${COMPONENTS_DIR}/ui/PerformanceReport.tsx"
    )
    
    # Check each critical file
    local MISSING_FILES=()
    for file in "${CRITICAL_FILES[@]}"; do
        if [[ ! -f "${file}" ]]; then
            MISSING_FILES+=("${file}")
        fi
    done
    
    if [[ ${#MISSING_FILES[@]} -gt 0 ]]; then
        log "WARNING" "The following critical files are missing: ${MISSING_FILES[*]}"
        log "WARNING" "Some optimizations may not be properly applied"
    else
        log "SUCCESS" "All critical optimization files are present"
    fi
    
    # Verify next.config.js optimizations
    if grep -q "optimizeCss" "${NEXT_CONFIG}" && grep -q "splitChunks" "${NEXT_CONFIG}"; then
        log "SUCCESS" "next.config.js successfully optimized"
    else
        log "WARNING" "next.config.js may not be properly optimized"
    fi
    
    # Verify service worker registration
    if grep -q "registerServiceWorker" "${PAGES_DIR}/_app.tsx"; then
        log "SUCCESS" "Service worker registration configured"
    else
        log "WARNING" "Service worker registration may not be properly configured"
    fi
    
    # Verify package.json dependencies
    if grep -q "\"next\":" "${PACKAGE_JSON}" && grep -q "\"swr\":" "${PACKAGE_JSON}"; then
        log "SUCCESS" "Required dependencies found in package.json"
    else
        log "WARNING" "Some required dependencies may be missing in package.json"
    fi
}

# Run all optimization steps
run_all_optimizations() {
    echo -e "\n${BOLD}SP1SH PERFORMANCE OPTIMIZER${NC}"
    echo -e "${BOLD}============================${NC}\n"
    
    # Run security checks first
    check_permissions
    
    # Make sure we have the required dependencies
    check_dependencies
    
    # Create backups
    create_backups
    
    # Run all optimizations
    implement_code_splitting
    optimize_images
    setup_caching
    implement_ssr
    
    # Verify optimizations
    verify_optimizations
    
    log "SUCCESS" "🎉 All optimizations have been successfully applied"
    
    # Provide recommended next steps
    cat << EOF

${BOLD}RECOMMENDED NEXT STEPS:${NC}
1. Run '${YELLOW}npm run build${NC}' to apply the optimizations
2. Test the application with '${YELLOW}npm run start${NC}'
3. Verify the performance improvements using browser developer tools

${BOLD}PERFORMANCE MONITORING:${NC}
- The PerformanceReport component is automatically included in development mode
- Add it to production with: <PerformanceReport showInProduction={true} />
- Check the Network tab in Chrome DevTools to see optimized resource loading
- Use Lighthouse to measure overall performance improvements

${BOLD}BACKUP LOCATION:${NC}
All original files have been backed up to ${BACKUP_DIR}

${BOLD}TROUBLESHOOTING:${NC}
- If you encounter issues, run '${YELLOW}npm run dev${NC}' and check the console for errors
- You can manually revert changes by copying files from the backup directory
- The offline page at /offline can be tested by turning off network in DevTools

For any further customization or specific performance needs, consult the
Next.js documentation at https://nextjs.org/docs/advanced-features/performance

EOF
}

# Execute all optimizations
run_all_optimizations

exit 0