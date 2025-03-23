#!/bin/bash

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Starting template integration...${NC}"

# 1. Define paths
TEMPLATE_PATH="./template-html/t.html"
COMPONENTS_DIR="./components/scripts"
PAGES_DIR="./pages/scripts"
STYLES_DIR="./styles"

# 2. Check if template file exists
if [ ! -f "$TEMPLATE_PATH" ]; then
  echo -e "${RED}Error: Template file $TEMPLATE_PATH not found!${NC}"
  exit 1
fi

# 3. Ensure directories exist
mkdir -p "$COMPONENTS_DIR"
mkdir -p "$PAGES_DIR"

# 4. Extract CSS from template and add it to globals.css
echo -e "${YELLOW}Extracting CSS styles from template...${NC}"
CSS_CONTENT=$(grep -ozP '(?<=<style>).*(?=</style>)' "$TEMPLATE_PATH" | tr '\0' '\n')

# Append to globals.css if not already present
if ! grep -q "terminal-header" "$STYLES_DIR/globals.css"; then
  echo -e "\n/* Imported from HTML template */" >> "$STYLES_DIR/globals.css"
  echo "$CSS_CONTENT" >> "$STYLES_DIR/globals.css"
  echo -e "${GREEN}Added CSS to globals.css${NC}"
else
  echo -e "${YELLOW}CSS styles already exist in globals.css${NC}"
fi

# 5. Create or update ScriptCode component
echo -e "${YELLOW}Creating ScriptCode component...${NC}"
cat > "$COMPONENTS_DIR/ScriptCode.tsx" << 'EOL'
import React, { RefObject } from 'react';
import { Script } from '../../mocks/scripts';

type ScriptCodeProps = {
  script: Script;
  codeRef: RefObject<HTMLPreElement>;
};

export const ScriptCode = ({ script, codeRef }: ScriptCodeProps) => {
  return (
    <div className="mb-8">
      <div className="flex border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium tab-active">Script Code</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Documentation</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Usage Examples</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Versions</button>
      </div>
      
      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 mt-4">
        <div className="terminal-header flex items-center justify-between p-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="ml-3 text-xs text-gray-400">
            {script.title.toLowerCase().replace(/\s+/g, '-')}.sh
          </div>
          
          <div className="flex gap-2">
            <button 
              className="text-white hover:text-gray-300 px-2"
              onClick={() => {
                if (codeRef.current) {
                  navigator.clipboard.writeText(script.code);
                }
              }}
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
            <button 
              className="text-white hover:text-gray-300 px-2"
              onClick={() => {
                const blob = new Blob([script.code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}.sh`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="terminal-body">
          <pre ref={codeRef} className="p-4 text-sm overflow-auto">
            <code className="language-bash">
              {script.code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
EOL

echo -e "${GREEN}Created ScriptCode component${NC}"

# 6. Create or update ScriptActions component
echo -e "${YELLOW}Creating ScriptActions component...${NC}"
cat > "$COMPONENTS_DIR/ScriptActions.tsx" << 'EOL'
import React from 'react';
import { Script } from '../../mocks/scripts';

type ScriptActionsProps = {
  script: Script;
};

export const ScriptActions = ({ script }: ScriptActionsProps) => {
  const handleDownload = () => {
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <button 
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        Download Script
      </button>
      
      <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        Copy Script
      </button>
      
      <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
        Share Script
      </button>
      
      <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-auto">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        Save
      </button>
    </div>
  );
};
EOL

echo -e "${GREEN}Created ScriptActions component${NC}"

# 7. Create or update ScriptTags component
echo -e "${YELLOW}Creating ScriptTags component...${NC}"
cat > "$COMPONENTS_DIR/ScriptTags.tsx" << 'EOL'
import React from 'react';
import Link from 'next/link';

type ScriptTagsProps = {
  tags: string[];
};

export const ScriptTags = ({ tags }: ScriptTagsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Link 
            key={tag}
            href={`/tags/${tag}`}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};
EOL

echo -e "${GREEN}Created ScriptTags component${NC}"

# 8. Create or update ScriptMetadata component
echo -e "${YELLOW}Creating ScriptMetadata component...${NC}"
cat > "$COMPONENTS_DIR/ScriptMetadata.tsx" << 'EOL'
import React from 'react';
import Link from 'next/link';
import { Script } from '../../mocks/scripts';

type ScriptMetadataProps = {
  script: Script;
};

export const ScriptMetadata = ({ script }: ScriptMetadataProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Script Metadata</h2>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</div>
          <div className="flex items-center mt-1">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">
              {script.authorName.substring(0, 2)}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">{script.authorName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">@{script.authorUsername}</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
          <div className="text-sm">{formatDate(script.updatedAt)}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatibility</div>
          <div className="text-sm capitalize">{script.os === 'cross-platform' ? 'All platforms' : script.os}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</div>
          <div className="text-sm capitalize">{script.category.replace('-', ' ')}</div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Downloads</div>
            <div className="text-xl font-bold text-primary dark:text-primary-light">{script.downloads.toLocaleString()}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</div>
            <div className="flex items-center">
              <div className="text-xl font-bold text-primary dark:text-primary-light mr-2">{script.rating.toFixed(1)}</div>
              <div className="text-yellow-500">{'⭐'.repeat(Math.round(script.rating))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
EOL

echo -e "${GREEN}Created ScriptMetadata component${NC}"

# 9. Create or update ScriptComments component
echo -e "${YELLOW}Creating ScriptComments component...${NC}"
cat > "$COMPONENTS_DIR/ScriptComments.tsx" << 'EOL'
import React from 'react';

export const ScriptComments = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {/* Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <textarea 
          placeholder="Share your experience with this script..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          rows={3}
        ></textarea>
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors">
            Post Comment
          </button>
        </div>
      </div>
      
      {/* Comment List - Sample data */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">JD</div>
              <div className="ml-2">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 days ago</div>
              </div>
            </div>
            <div className="flex items-center text-yellow-500">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This script saved my servers during a recent CPU spike incident. Highly recommended for any sysadmin managing multiple systems.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">JS</div>
              <div className="ml-2">
                <div className="text-sm font-medium">Jane Smith</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1 week ago</div>
              </div>
            </div>
            <div className="flex items-center text-yellow-500">
              <span>⭐⭐⭐⭐</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Works great! I modified it to send alerts to our Slack channel and it's been incredibly helpful.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <button className="text-sm text-primary dark:text-primary-light hover:underline">
          Load More Comments
        </button>
      </div>
    </div>
  );
};
EOL

echo -e "${GREEN}Created ScriptComments component${NC}"

# 10. Create or update RelatedScripts component
echo -e "${YELLOW}Creating RelatedScripts component...${NC}"
cat > "$COMPONENTS_DIR/RelatedScripts.tsx" << 'EOL'
import React from 'react';
import Link from 'next/link';
import { Script } from '../../mocks/scripts';

type RelatedScriptsProps = {
  scripts: Script[];
};

export const RelatedScripts = ({ scripts }: RelatedScriptsProps) => {
  const getOSBadgeClass = (os: string) => {
    switch (os) {
      case 'linux':
        return 'bg-linux-green/10 text-linux-green';
      case 'windows':
        return 'bg-windows-blue/10 text-windows-blue';
      case 'macos':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'cross-platform':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'linux':
        return '🐧';
      case 'windows':
        return '🪟';
      case 'macos':
        return '🍎';
      case 'cross-platform':
        return '🔄';
      default:
        return '💻';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Related Scripts</h2>
      
      {scripts.length > 0 ? (
        <div className="space-y-4">
          {scripts.map(script => (
            <div key={script.id} className="flex border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
                {script.category === 'monitoring' && '📊'}
                {script.category === 'maintenance' && '🧹'}
                {script.category === 'security' && '🔒'}
                {script.category === 'networking' && '🌐'}
                {script.category === 'backup' && '💾'}
                {script.category === 'performance' && '⚡'}
                {script.category === 'emergency' && '🚨'}
                {!['monitoring', 'maintenance', 'security', 'networking', 'backup', 'performance', 'emergency'].includes(script.category) && '📜'}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium hover:text-primary dark:hover:text-primary-light">
                  <Link href={`/scripts/${script.id}`}>{script.title}</Link>
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className={`inline-flex items-center ${getOSBadgeClass(script.os)} rounded-full px-2 py-0.5`}>
                    {getOSIcon(script.os)} {script.os === 'cross-platform' ? 'Cross' : script.os}
                  </span>
                  <span className="ml-2">{script.rating.toFixed(1)} ⭐</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
          No related scripts found
        </p>
      )}
      
      <div className="mt-4 text-center">
        <Link href="/scripts" className="text-sm text-primary dark:text-primary-light hover:underline">
          View More Scripts
        </Link>
      </div>
    </div>
  );
};
EOL

echo -e "${GREEN}Created RelatedScripts component${NC}"

# 11. Update page template to use our new components
echo -e "${YELLOW}Updating scripts/[id].tsx page...${NC}"
cat > "$PAGES_DIR/[id].tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
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

export default function ScriptDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  
  const script = typeof id === 'string' ? getScriptById(id) : undefined;
  
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
    router.back();
  };

  if (isLoading) {
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
EOL

echo -e "${GREEN}Updated scripts/[id].tsx page${NC}"

# 12. Create script to add CSS variables to tailwind.config.js if needed
echo -e "${YELLOW}Ensuring CSS variables are in tailwind.config.js...${NC}"

# Check if css variables already exist
if ! grep -q "terminal-bg" "./tailwind.config.js"; then
  # Backup the original file
  cp "./tailwind.config.js" "./tailwind.config.js.bak"
  
  # Use sed to add CSS variables to the theme.extend.colors section
  sed -i.tmp '/colors: {/,/},/ s/},/        terminal: {\n          bg: "#1e1e1e",\n          text: "#f8f8f8",\n          green: "#4af626",\n        },\n      },/' "./tailwind.config.js"
  
  # Clean up temporary file
  rm -f "./tailwind.config.js.tmp"
  
  echo -e "${GREEN}Added terminal colors to tailwind.config.js${NC}"
else
  echo -e "${YELLOW}Terminal colors already exist in tailwind.config.js${NC}"
fi

# 13. Make sure to install prismjs for syntax highlighting
echo -e "${YELLOW}Checking for Prism.js...${NC}"
if ! grep -q "prismjs" "./package.json"; then
  echo -e "${YELLOW}Prism.js not found in package.json, please install it:${NC}"
  echo "npm install prismjs"
  echo "npm install @types/prismjs --save-dev"
else
  echo -e "${GREEN}Prism.js already installed${NC}"
fi

# 14. Clean up .next folder to ensure changes take effect
echo -e "${YELLOW}Cleaning up Next.js cache...${NC}"
if [ -d ".next" ]; then
  rm -rf ".next"
  echo -e "${GREEN}Cleared Next.js cache${NC}"
fi

echo -e "${GREEN}Template integration complete!${NC}"
echo -e "Start your development server with ${YELLOW}npm run dev${NC} to see the changes."
echo -e "Navigate to ${YELLOW}http://localhost:3000${NC} to see the changes."
echo -e "Visit a script page (e.g., ${YELLOW}http://localhost:3000/scripts/script-1${NC}) to see the template integration."

# 15. Fix potential back button issues
echo -e "${YELLOW}Adding workaround for back button issues...${NC}"

# Create utility function to help with navigation
mkdir -p "./utils"
cat > "./utils/navigation.ts" << 'EOL'
/**
 * Navigation utility to help with proper routing in Next.js
 */

import { useRouter } from 'next/router';

/**
 * Enhanced back function that ensures proper navigation when the back button is pressed
 * Falls back to homepage if there's no history
 */
export const goBack = () => {
  const router = useRouter();
  
  if (window.history.length > 1) {
    router.back();
  } else {
    // No history, redirect to home
    router.push('/');
  }
};

/**
 * Navigate to a specific script page
 */
export const navigateToScript = (scriptId: string) => {
  const router = useRouter();
  router.push(`/scripts/${scriptId}`);
};

/**
 * Navigate to category page
 */
export const navigateToCategory = (category: string) => {
  const router = useRouter();
  router.push(`/categories/${category}`);
};

/**
 * Navigate to OS page
 */
export const navigateToOS = (os: string) => {
  const router = useRouter();
  router.push(`/os/${os}`);
};
EOL

# Update ScriptDetailHeader to use proper navigation
cat > "$COMPONENTS_DIR/ScriptDetailHeader.tsx" << 'EOL'
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Script } from '../../mocks/scripts';

type ScriptDetailHeaderProps = {
  script: Script;
};

export const ScriptDetailHeader = ({ script }: ScriptDetailHeaderProps) => {
  const router = useRouter();
  
  const getOSBadgeClass = () => {
    switch (script.os) {
      case 'linux':
        return 'bg-linux-green/10 text-linux-green';
      case 'windows':
        return 'bg-windows-blue/10 text-windows-blue';
      case 'macos':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'cross-platform':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const goToCategory = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    router.push(`/categories/${category}`);
  };

  const goToOS = (e: React.MouseEvent, os: string) => {
    e.preventDefault();
    router.push(`/os/${os}`);
  };

  const goToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
        <a href="/" onClick={goToHome} className="hover:text-primary dark:hover:text-primary-light">
          Home
        </a>
        <span>/</span>
        <a 
          href={`/os/${script.os}`} 
          onClick={(e) => goToOS(e, script.os)}
          className="hover:text-primary dark:hover:text-primary-light"
        >
          {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
        </a>
        <span>/</span>
        <a 
          href={`/categories/${script.category}`} 
          onClick={(e) => goToCategory(e, script.category)}
          className="hover:text-primary dark:hover:text-primary-light"
        >
          {script.category.charAt(0).toUpperCase() + script.category.slice(1).replace('-', ' ')}
        </a>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {script.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOSBadgeClass()}`}>
          {script.os === 'linux' && '🐧 '}
          {script.os === 'windows' && '🪟 '}
          {script.os === 'macos' && '🍎 '}
          {script.os === 'cross-platform' && '🔄 '}
          {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
        </span>
        
        <div className="flex items-center gap-1 text-yellow-500">
          <span>⭐</span>
          <span>{script.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <span>⬇️</span>
          <span>{script.downloads.toLocaleString()} downloads</span>
        </div>
        
        {script.emergencyLevel && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            script.emergencyLevel === 'critical' 
              ? 'bg-emergency-red/10 text-emergency-red' 
              : script.emergencyLevel === 'high'
                ? 'bg-emergency-orange/10 text-emergency-orange'
                : 'bg-emergency-yellow/10 text-emergency-yellow'
          }`}>
            {script.emergencyLevel === 'critical' && '🔥 '}
            {script.emergencyLevel === 'high' && '⚠️ '}
            {script.emergencyLevel === 'medium' && '⚠️ '}
            {script.emergencyLevel.charAt(0).toUpperCase() + script.emergencyLevel.slice(1)}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        {script.description}
      </p>
    </div>
  );
};
EOL

# Update the script/[id].tsx file to fix back button issue
cat > "$PAGES_DIR/[id].tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
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

export default function ScriptDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getScriptById, allScripts, isLoading } = useScripts();
  const codeRef = useRef<HTMLPreElement>(null);
  
  const script = typeof id === 'string' ? getScriptById(id) : undefined;
  
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

  if (isLoading) {
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
EOL

# Create page stubs for missing routes
echo -e "${YELLOW}Creating page stubs for navigation...${NC}"

# Create OS pages stub
mkdir -p "$PAGES_DIR/../os"
cat > "$PAGES_DIR/../os/[os].tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function OSPage() {
  const router = useRouter();
  const { os } = router.query;
  const { setCurrentOS, isLoading } = useScripts();
  
  useEffect(() => {
    if (os && typeof os === 'string') {
      // Set OS filter
      setCurrentOS(os as any);
      
      // This is a temporary page, redirect to home with the filter applied
      router.push('/');
    }
  }, [os, setCurrentOS, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${os} Scripts | Sp1sh`} description={`Browse scripts for ${os}`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to filtered scripts...</h1>
      </div>
    </Layout>
  );
}
EOL

# Create categories pages stub
mkdir -p "$PAGES_DIR/../categories"
cat > "$PAGES_DIR/../categories/[category].tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    if (category && typeof category === 'string') {
      // Set category filter
      setCurrentCategory(category as any);
      
      // This is a temporary page, redirect to home with the filter applied
      router.push('/');
    }
  }, [category, setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${category} Scripts | Sp1sh`} description={`Browse ${category} scripts`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to filtered scripts...</h1>
      </div>
    </Layout>
  );
}
EOL

# Create emergency page stub
cat > "$PAGES_DIR/../emergency.tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../context/ScriptsContext';
import { Layout } from '../components/layout/Layout';
import { LoadingPlaceholder } from '../components/ui/LoadingPlaceholder';

export default function EmergencyPage() {
  const router = useRouter();
  const { setCurrentCategory, isLoading } = useScripts();
  
  useEffect(() => {
    // Set emergency category filter
    setCurrentCategory('emergency');
    
    // This is a temporary page, redirect to home with the filter applied
    router.push('/');
  }, [setCurrentCategory, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title="Emergency Scripts | Sp1sh" description="Browse emergency scripts for critical situations">
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to emergency scripts...</h1>
      </div>
    </Layout>
  );
}
EOL

# Create tags pages stub
mkdir -p "$PAGES_DIR/../tags"
cat > "$PAGES_DIR/../tags/[tag].tsx" << 'EOL'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useScripts } from '../../context/ScriptsContext';
import { Layout } from '../../components/layout/Layout';
import { LoadingPlaceholder } from '../../components/ui/LoadingPlaceholder';

export default function TagPage() {
  const router = useRouter();
  const { tag } = router.query;
  const { setSearchTerm, isLoading } = useScripts();
  
  useEffect(() => {
    if (tag && typeof tag === 'string') {
      // Set search term to the tag value
      setSearchTerm(tag);
      
      // This is a temporary page, redirect to home with the search applied
      router.push({
        pathname: '/',
        query: { search: tag }
      });
    }
  }, [tag, setSearchTerm, router]);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Layout title={`${tag} Scripts | Sp1sh`} description={`Browse scripts tagged with ${tag}`}>
      <div className="container mx-auto px-4 py-8">
        <h1>Redirecting to tagged scripts...</h1>
      </div>
    </Layout>
  );
}
EOL

echo -e "${GREEN}Created navigation stubs${NC}"

# Add a test script to quickly verify the integration 
echo -e "${YELLOW}Creating test script...${NC}"
cat > "./test-template-integration.sh" << 'EOL'
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
EOL

chmod +x "./test-template-integration.sh"
echo -e "${GREEN}Created test script${NC}"

echo -e "${GREEN}Template integration complete!${NC}"
echo -e "Run ${YELLOW}./test-template-integration.sh${NC} to test the integration, or"
echo -e "Start your development server with ${YELLOW}npm run dev${NC} to see the changes manually."