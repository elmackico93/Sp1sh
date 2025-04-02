import { useEffect, useState } from 'react';

interface ScriptTerminalSessionProps {
  onStartSession?: () => void;
  onEndSession?: () => void;
}

const generateSessionId = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

export default function ScriptTerminalSession({ onStartSession, onEndSession }: ScriptTerminalSessionProps) {
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [allowExecution, setAllowExecution] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [connectedCount, setConnectedCount] = useState(1);
  const maxUsers = 4;
  const [copied, setCopied] = useState(false);

  // Call onStartSession when session is initiated
  useEffect(() => {
    onStartSession?.();
    // Cleanup: call onEndSession if session still active on unmount
    return () => {
      onEndSession?.();
    };
  }, []);

  // Countdown timer for session time left
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger onEndSession when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      onEndSession?.();
    }
  }, [timeLeft]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId).catch(err => console.error("Copy failed", err));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshSession = () => {
    setSessionId(generateSessionId());
    setTimeLeft(1800);
    setCopied(false);
    // (Continue the session – no need to call onEndSession/onStartSession here)
  };

  const handleEndSession = () => {
    setTimeLeft(0);
    // onEndSession will be triggered by the effect when timeLeft hits 0
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center">
          <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded border border-gray-300">
            {sessionId}
          </span>
          <button
            onClick={handleCopy}
            className="ml-2 text-sm text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="mt-2 lg:mt-0">
          <span className="text-sm text-gray-600">{connectedCount}/{maxUsers} users connected</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-800">
          Time remaining: <span className="font-semibold">{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </p>
        <div className="mt-2 sm:mt-0 flex gap-2">
          <button
            onClick={handleRefreshSession}
            className="bg-gray-100 text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-200"
          >
            Refresh Session
          </button>
          <button
            onClick={handleEndSession}
            className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/download/windows" className="block border border-gray-300 rounded-lg p-4 hover:bg-gray-50">
          <h3 className="font-semibold">Windows</h3>
          <p className="mt-1 text-sm">Download Windows client</p>
        </a>
        <a href="/download/mac" className="block border border-gray-300 rounded-lg p-4 hover:bg-gray-50">
          <h3 className="font-semibold">macOS</h3>
          <p className="mt-1 text-sm">Download macOS client</p>
        </a>
        <a href="/download/linux" className="block border border-gray-300 rounded-lg p-4 hover:bg-gray-50">
          <h3 className="font-semibold">Linux</h3>
          <p className="mt-1 text-sm">Download Linux client</p>
        </a>
      </div>

      <h2 className="mt-6 font-semibold">Connection Steps:</h2>
      <ol className="mt-2 list-decimal list-inside text-sm">
        <li>Download and install client.</li>
        <li>Launch client, enter session ID.</li>
        <li>Click "Connect" to join.</li>
      </ol>

      <div className="mt-4 flex space-x-6">
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={allowExecution} 
            onChange={e => setAllowExecution(e.target.checked)} 
          />
          Allow Execution
        </label>
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={readOnly} 
            onChange={e => setReadOnly(e.target.checked)} 
          />
          Read-Only Mode
        </label>
      </div>
    </div>
  );
}
