import React from 'react';
import Link from 'next/link';
import { categories } from '../../mocks/scripts';

export const CategoriesSection = () => {
  return (
    <section className="mb-10 py-8 bg-gray-50 dark:bg-gray-850 -mx-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Browse by Category
        </h2>
        <Link 
          href="/categories"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          View all categories <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-lg">
                {category.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {category.count} scripts
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5">
                {category.popularTags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 text-center">
              <Link
                href={`/categories/${category.id}`}
                className="text-sm font-medium text-primary hover:underline inline-flex items-center justify-center"
              >
                Browse Scripts <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
