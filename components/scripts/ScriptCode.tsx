import React, { RefObject } from 'react';
import { Script } from '../../mocks/scripts';

type ScriptCodeProps = {
  script: Script;
  codeRef: RefObject<HTMLPreElement>;
  onCopy?: () => void;
  showCopyFeedback?: boolean;
};

export const ScriptCode = ({ script, codeRef, onCopy, showCopyFeedback = false }: ScriptCodeProps) => {
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (codeRef.current) {
      navigator.clipboard.writeText(script.code);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button className="px-4 py-2 text-sm font-medium tab-active">Script Code</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Documentation</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Usage Examples</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Versions</button>
      </div>
      
      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 mt-4">
        <div className="terminal-header flex items-center justify-between p-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="ml-3 text-xs text-gray-400">
            {script.title.toLowerCase().replace(/\s+/g, '-')}.sh
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`text-white hover:text-gray-300 px-2 relative ${showCopyFeedback ? 'text-green-400' : ''}`}
              onClick={handleCopy}
              title={showCopyFeedback ? "Copied!" : "Copy to clipboard"}
            >
              {showCopyFeedback ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              )}
              
              {/* Show feedback tooltip */}
              {showCopyFeedback && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
            <button 
              className="text-white hover:text-gray-300 px-2"
              onClick={() => {
                const blob = new Blob([script.code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${script.title.toLowerCase().replace(/\s+/g, '-')}.sh`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="terminal-body">
          <pre ref={codeRef} className="p-4 text-sm overflow-auto">
            <code className="language-bash">
              {script.code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
