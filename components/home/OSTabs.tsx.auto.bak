import React, { useState } from 'react';
import Link from 'next/link';
import { useScripts } from '../../context/ScriptsContext';
import { ScriptCard } from '../scripts/ScriptCard';
import { OSType } from '../../mocks/scripts';

export const OSTabs = () => {
  const { allScripts } = useScripts();
  const [activeTab, setActiveTab] = useState<OSType>('linux');
  
  const filteredScripts = allScripts.filter(
    script => script.os === activeTab || (activeTab === 'linux' && script.os === 'cross-platform')
  ).slice(0, 3);

  return (
    <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            className={`px-6 py-4 font-medium text-sm focus:outline-none ${
              activeTab === 'linux'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('linux')}
          >
            Linux Scripts
          </button>
          
          <button
            className={`px-6 py-4 font-medium text-sm focus:outline-none ${
              activeTab === 'windows'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('windows')}
          >
            Windows Scripts
          </button>
          
          <button
            className={`px-6 py-4 font-medium text-sm focus:outline-none ${
              activeTab === 'macos'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('macos')}
          >
            macOS Scripts
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredScripts.length > 0 ? (
            filteredScripts.map(script => (
              <ScriptCard key={script.id} script={script} />
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500 dark:text-gray-400">
              No scripts available for this OS yet. <Link href="/add-script" className="text-primary hover:underline">Be the first to contribute!</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
