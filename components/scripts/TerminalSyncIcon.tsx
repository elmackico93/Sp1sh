import { useState } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import TerminalSync from './TerminalSync';
import { useTerminal } from '../../context/TerminalContext';
=======
import ScriptTerminalSession from './ScriptTerminalSession';
>>>>>>> parent of d03a65f (Minor change)
=======
import ScriptTerminalSession from './ScriptTerminalSession';
>>>>>>> parent of d03a65f (Minor change)
=======
import ScriptTerminalSession from './ScriptTerminalSession';
>>>>>>> parent of d03a65f (Minor change)

export default function TerminalSyncIcon() {
  const [isConnected, setIsConnected] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { isTerminalConnected } = useTerminal();

  const handleStartSession = () => setIsConnected(true);
  const handleEndSession = () => setIsConnected(false);

  const handleStartSession = () => setIsConnected(true);
  const handleEndSession = () => setIsConnected(false);

  const handleStartSession = () => setIsConnected(true);
  const handleEndSession = () => setIsConnected(false);

  return (
    <div className="relative">
      <button
        onClick={() => setPanelOpen(prev => !prev)}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        title={isTerminalConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        aria-label={isTerminalConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
=======
        title={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        aria-label={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
>>>>>>> parent of d03a65f (Minor change)
=======
        title={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        aria-label={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
>>>>>>> parent of d03a65f (Minor change)
=======
        title={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
        aria-label={isConnected ? 'Terminal Connected' : 'Connect to Your Terminal'}
>>>>>>> parent of d03a65f (Minor change)
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
            d="M3.25 3A2.25 2.25 0 0 0 1 5.25v9.5A2.25 2.25 0 0 0 3.25 
17h13.5A2.25 2.25 0 0 0 19 14.75v-9.5A2.25 2.25 0 0 0 16.75 3H3.25Zm.943 
8.752a.75.75 0 0 1 .055-1.06L6.128 9l-1.88-1.693a.75.75 0 1 1 1.004-1.114l2.5 
2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 0 1-1.06-.055ZM9.75 10.25a.75.75 0 
0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span
          className={
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            `absolute top-0 right-0 block h-2 w-2 rounded-full ${
              isTerminalConnected 
                ? 'bg-green-500 terminal-connected-pulse' 
                : 'bg-gray-400'
            }`
=======
            'absolute top-0 right-0 block h-2 w-2 rounded-full ' +
            (isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400')
>>>>>>> parent of d03a65f (Minor change)
=======
            'absolute top-0 right-0 block h-2 w-2 rounded-full ' +
            (isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400')
>>>>>>> parent of d03a65f (Minor change)
=======
            'absolute top-0 right-0 block h-2 w-2 rounded-full ' +
            (isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400')
>>>>>>> parent of d03a65f (Minor change)
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
            <ScriptTerminalSession
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
            />
          </div>
        </div>
      )}
    </div>
  );
}