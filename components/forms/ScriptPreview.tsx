import React, { RefObject } from 'react';
import { OSType, ScriptCategory } from '../../mocks/scripts';

interface ScriptPreviewProps {
  script: {
    title: string;
    description: string;
    os: OSType;
    category: ScriptCategory;
    tags: string[];
    code: string;
    authorName: string;
    authorUsername: string;
  };
  codeRef: RefObject<HTMLPreElement>;
}

export const ScriptPreview: React.FC<ScriptPreviewProps> = ({
  script,
  codeRef
}) => {
  // Helper to get OS badge styling
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

  // Helper to get OS icon
  const getOSIcon = () => {
    switch (script.os) {
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

  // Helper to get category icon
  const getCategoryIcon = () => {
    switch (script.category) {
      case 'monitoring':
        return '📊';
      case 'maintenance':
        return '🧹';
      case 'security':
        return '🔒';
      case 'networking':
        return '🌐';
      case 'backup':
        return '💾';
      case 'performance':
        return '⚡';
      case 'emergency':
        return '🚨';
      case 'system-admin':
        return '🔧';
      default:
        return '📜';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Script Header */}
      <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {script.title || 'Untitled Script'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {script.description || 'No description provided.'}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOSBadgeClass()}`}>
            {getOSIcon()} {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
          </span>
          
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
            <span className="text-lg">{getCategoryIcon()}</span>
            <span className="capitalize">{script.category.replace('-', ' ')}</span>
          </div>
        </div>
        
        {/* Tags */}
        {script.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {script.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Author Information */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">
            {script.authorName?.substring(0, 2) || 'U'}
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">{script.authorName || 'Unknown'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              @{script.authorUsername || 'username'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Script Code Preview */}
      <div className="terminal-header flex items-center justify-between p-2">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        <div className="ml-3 text-xs text-gray-400">
          {script.title?.toLowerCase().replace(/\s+/g, '-') || 'script'}.
          {script.os === 'windows' ? 'ps1' : 'sh'}
        </div>
      </div>
      
      <div className="terminal-body">
        <pre ref={codeRef} className="p-4 text-sm overflow-auto max-h-[400px]">
          <code className={`language-${script.os === 'windows' ? 'powershell' : 'bash'}`}>
            {script.code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default ScriptPreview;