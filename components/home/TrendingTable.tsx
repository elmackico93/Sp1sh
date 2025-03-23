import React from 'react';
import Link from 'next/link';
import { useScripts } from '../../context/ScriptsContext';

export const TrendingTable = () => {
  const { allScripts } = useScripts();
  
  // Sort scripts by downloads to get trending ones
  const trendingScripts = [...allScripts]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

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
              {trendingScripts.map((script) => (
                <tr key={script.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                    {script.title}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                    {script.os === 'cross-platform' ? 'Cross' : script.os}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                    {script.category.charAt(0).toUpperCase() + script.category.slice(1).replace('-', ' ')}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 text-right hidden sm:table-cell">
                    {script.downloads.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                    {script.rating.toFixed(1)}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/scripts/${script.id}`}
                      className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
