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
