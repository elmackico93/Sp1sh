import React from 'react';
import Link from 'next/link';
import { Script } from '../../mocks/scripts';

type ScriptDetailHeaderProps = {
  script: Script;
};

export const ScriptDetailHeader = ({ script }: ScriptDetailHeaderProps) => {
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

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-primary dark:hover:text-primary-light">
          Home
        </Link>
        <span>/</span>
        <Link 
          href={`/os/${script.os}`} 
          className="hover:text-primary dark:hover:text-primary-light"
        >
          {script.os.charAt(0).toUpperCase() + script.os.slice(1)}
        </Link>
        <span>/</span>
        <Link 
          href={`/categories/${script.category}`} 
          className="hover:text-primary dark:hover:text-primary-light"
        >
          {script.category.charAt(0).toUpperCase() + script.category.slice(1).replace('-', ' ')}
        </Link>
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
