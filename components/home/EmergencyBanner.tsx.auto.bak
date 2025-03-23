import React from 'react';
import Link from 'next/link';

export const EmergencyBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emergency-red/10 to-emergency-red/5 rounded-lg border-l-4 border-emergency-red p-4 md:p-6 my-6 flex flex-col md:flex-row gap-4 md:items-center">
      <div className="text-emergency-red text-xl md:text-2xl flex-shrink-0">⚠️</div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">System Emergency? We've got you covered.</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          Quick access to critical recovery, security response, and system diagnostic scripts. Verified solutions for urgent situations.
        </p>
      </div>
      
      <Link
        href="/emergency"
        className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 text-emergency-red border border-emergency-red/30 rounded-full text-sm font-medium whitespace-nowrap hover:bg-emergency-red/10 transition-colors"
      >
        Emergency Scripts
      </Link>
    </div>
  );
};
