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
