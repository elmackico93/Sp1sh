import React, { useState } from 'react';
import Link from 'next/link';
import { useScripts } from '../../context/ScriptsContext';
import { TrendingTableRow } from './components/TrendingTableRow';

export const TrendingTable = () => {
  const { allScripts } = useScripts();
  const [openPreviewIndex, setOpenPreviewIndex] = useState<number | null>(null);
  
  // Sort scripts by downloads to get trending ones
  const trendingScripts = [...allScripts]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  // Handle preview toggling
  const handlePreviewToggle = (index: number, isOpen: boolean) => {
    setOpenPreviewIndex(isOpen ? index : null);
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Trending Scripts
        </h2>
        <Link 
          href="/trending"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          See all rankings <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400" style={{ width: '40%' }}>
                  Script Name
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  OS
                </th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">
                  Category
                </th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  Downloads
                </th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Rating
                </th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {trendingScripts.map((script, index) => (
                <TrendingTableRow 
                  key={script.id}
                  script={script}
                  index={index}
                  onPreviewToggle={handlePreviewToggle}
                  isPreviewOpen={openPreviewIndex === index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TrendingTable;
