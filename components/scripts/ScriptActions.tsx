import React, { useState } from 'react';
import { Script } from '../../mocks/scripts';
import dynamic from 'next/dynamic';

// Dynamically import the DownloadModal to avoid SSR issues
const DownloadModal = dynamic(() => import('./DownloadModal'), {
  ssr: false,
});

type ScriptActionsProps = {
  script: Script;
  onCopy?: () => void;
  showCopyFeedback?: boolean;
};

export const ScriptActions = ({ script, onCopy, showCopyFeedback = false }: ScriptActionsProps) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  const handleDownload = () => {
    try {
      const blob = new Blob([script.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}.${script.os === 'windows' ? 'ps1' : 'sh'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Close modal after download starts
      setIsDownloadModalOpen(false);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback in case the Blob approach fails
      alert('Download failed. Please try again or contact support.');
    }
  };
  
  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else {
      try {
        await navigator.clipboard.writeText(script.code);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button 
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download Script
        </button>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center justify-center gap-2 py-2 px-4 ${
            showCopyFeedback 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          } rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative overflow-hidden`}
        >
          {showCopyFeedback ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy Script
            </>
          )}
          
          {/* Animation for copy feedback */}
          {showCopyFeedback && (
            <span className="absolute inset-0 bg-green-500 animate-pulse opacity-20"></span>
          )}
        </button>
        
        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share Script
        </button>
        
        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors md:ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          Save
        </button>
      </div>
      
      {/* Download Modal */}
      {isDownloadModalOpen && (
        <DownloadModal
          script={script}
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
};

export default ScriptActions;