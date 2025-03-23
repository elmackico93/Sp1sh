import React from 'react';
import Link from 'next/link';
import { quickActions } from '../../mocks/scripts';

export const QuickActions = () => {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Quick Solutions
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={`/quick-actions/${action.id}`}
            className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <div className="text-3xl mb-3">
              {action.icon}
            </div>
            
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {action.name}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
              {action.description}
            </p>
            
            <div className="text-sm font-medium text-primary">
              {action.count} scripts available →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
