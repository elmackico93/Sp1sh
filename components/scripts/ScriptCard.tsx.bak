import React from 'react';
import Link from 'next/link';
import { Script } from '../../mocks/scripts';

type ScriptCardProps = {
  script: Script;
};

export const ScriptCard = ({ script }: ScriptCardProps) => {
  // Helper to determine OS badge styling
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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 relative">
        <h3 className="font-medium text-gray-900 dark:text-white mb-1 pr-16">
          {script.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{script.authorUsername}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{new Date(script.updatedAt).toLocaleDateString()}</span>
          </span>
        </div>
        
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${getOSBadgeClass()}`}>
          {getOSIcon()} {script.os === 'cross-platform' ? 'Cross' : script.os}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {script.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {script.tags.slice(0, 4).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {script.tags.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
              +{script.tags.length - 4} more
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <span>⭐</span>
            <span>{script.rating.toFixed(1)}</span>
          </span>
          
          <span className="flex items-center gap-1">
            <span>⬇️</span>
            <span>{script.downloads.toLocaleString()}</span>
          </span>
        </div>
        
        <Link 
          href={`/scripts/${script.id}`}
          className="inline-flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-medium rounded-full transition-colors"
        >
          View Script
        </Link>
      </div>
    </div>
  );
};
