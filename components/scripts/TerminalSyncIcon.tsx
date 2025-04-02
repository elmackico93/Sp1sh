import { useState } from 'react';
import TerminalSync from './TerminalSync';
import { useTerminal } from '../../context/TerminalContext';

export default function TerminalSyncIcon() {
  const [panelOpen, setPanelOpen] = useState(false);
  const { isTerminalConnected } = useTerminal();

  return (
    <div className="relative">
      <button
        onClick={() => setPanelOpen(prev => !prev)}
        title={isTerminalConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        aria-label={isTerminalConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25Zm.943 8.752a.75.75 0 0 1 .055-1.06L6.128 9l-1.88-1.693a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 0 1-1.06-.055ZM9.75 10.25a.75.75 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span
          className={
            `absolute top-0 right-0 block h-2 w-2 rounded-full ${
              isTerminalConnected 
                ? 'bg-green-500 terminal-connected-pulse' 
                : 'bg-gray-400'
            }`
          }
        />
      </button>

      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          onClick={() => setPanelOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div
            className="relative z-50 w-full max-w-md h-full bg-white dark:bg-gray-800 border-l border-gray-300 p-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <TerminalSync />
          </div>
        </div>
      )}
    </div>
  );
}