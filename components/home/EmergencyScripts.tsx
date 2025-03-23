import React from 'react';
import Link from 'next/link';
import { emergencyCategories } from '../../mocks/scripts';

export const EmergencyScripts = () => {
  return (
    <section className="mb-10" id="emergency-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          🚨 Emergency Scripts
        </h2>
        <Link 
          href="/emergency"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          View all emergency scripts <span className="ml-1">→</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyCategories.map((category) => (
          <div 
            key={category.id}
            className={`relative bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col`}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 
                  category.level === 'critical' 
                    ? 'linear-gradient(90deg, var(--emergency-red), var(--emergency-orange))' 
                    : category.level === 'high' 
                      ? 'linear-gradient(90deg, var(--emergency-orange), var(--emergency-yellow))' 
                      : 'linear-gradient(90deg, var(--emergency-yellow), var(--primary-light))'
              }}
            ></div>
            
            <div className="p-5 flex-grow">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-2xl mb-4">
                {category.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                <span>📜</span>
                <span>{category.count} scripts</span>
              </div>
              
              <Link 
                href={`/emergency/${category.id}`}
                className="text-sm font-medium text-primary inline-flex items-center hover:underline"
              >
                View all <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmergencyScripts;
