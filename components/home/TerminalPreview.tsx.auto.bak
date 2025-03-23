import React from 'react';

export const TerminalPreview = () => {
  return (
    <div className="bg-terminal-bg rounded-lg overflow-hidden shadow-md mb-8">
      <div className="flex items-center p-2 bg-black bg-opacity-20">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-xs text-gray-400">Terminal</div>
      </div>
      
      <div className="p-4 font-mono text-sm text-terminal-text overflow-x-auto">
        <div className="flex mb-2">
          <span className="text-terminal-green mr-2">user@server:~$</span>
          <span>find /var/log -name "*.log" -size +100M | sort -rh</span>
        </div>
        
        <div className="text-gray-400 mb-3 pl-4">
          /var/log/syslog.3.log<br />
          /var/log/apache2/access.log<br />
          /var/log/mysql/slow-query.log
        </div>
        
        <div className="flex mb-2">
          <span className="text-terminal-green mr-2">user@server:~$</span>
          <span>sudo ./cleanup-logs.sh --compress --older-than 30d</span>
        </div>
        
        <div className="text-gray-400 pl-4">
          [INFO] Starting log cleanup process...<br />
          [INFO] Found 28 log files older than 30 days<br />
          [INFO] Compressing files...<br />
          [INFO] Cleanup complete! Freed 4.2GB of disk space
        </div>
      </div>
    </div>
  );
};
