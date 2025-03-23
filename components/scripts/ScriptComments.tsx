import React from 'react';

export const ScriptComments = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {/* Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
        <textarea 
          placeholder="Share your experience with this script..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          rows={3}
        ></textarea>
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors">
            Post Comment
          </button>
        </div>
      </div>
      
      {/* Comment List - Sample data */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">JD</div>
              <div className="ml-2">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 days ago</div>
              </div>
            </div>
            <div className="flex items-center text-yellow-500">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            This script saved my servers during a recent CPU spike incident. Highly recommended for any sysadmin managing multiple systems.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium">JS</div>
              <div className="ml-2">
                <div className="text-sm font-medium">Jane Smith</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1 week ago</div>
              </div>
            </div>
            <div className="flex items-center text-yellow-500">
              <span>⭐⭐⭐⭐</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Works great! I modified it to send alerts to our Slack channel and it's been incredibly helpful.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <button className="text-sm text-primary dark:text-primary-light hover:underline">
          Load More Comments
        </button>
      </div>
    </div>
  );
};
