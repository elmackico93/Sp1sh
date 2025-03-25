import React, { useEffect, useRef } from 'react';
import { FiUpload, FiCopy, FiDownload } from 'react-icons/fi';
import { OSType } from '../../mocks/scripts';

interface ScriptCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  error?: string;
  os: OSType;
}

export const ScriptCodeEditor: React.FC<ScriptCodeEditorProps> = ({
  code,
  onChange,
  error,
  os
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [code]);

  // Handle tab key in textarea
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && document.activeElement === editorRef.current) {
        e.preventDefault();
        
        const textarea = editorRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const newCode = 
          code.substring(0, start) + 
          '  ' + 
          code.substring(end);
        
        onChange(newCode);
        
        // Set cursor position after the inserted tab
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd = start + 2;
          }
        }, 0);
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [code, onChange]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert('File is too large. Maximum file size is 1MB.');
      return;
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onChange(content);
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
  };

  // Handle file download
  const handleDownload = () => {
    const filename = `script.${os === 'windows' ? 'ps1' : 'sh'}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        // Show feedback (you could add a toast notification here)
        console.log('Code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Write or upload your {os === 'windows' ? 'PowerShell' : 'bash'} script
        </p>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <FiUpload size={14} />
            <span>Upload</span>
          </button>
          
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <FiCopy size={14} />
            <span>Copy</span>
          </button>
          
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <FiDownload size={14} />
            <span>Download</span>
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".sh,.bash,.ps1,.bat,.cmd,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      <div className={`overflow-hidden rounded-lg border ${
        error 
          ? 'border-red-500 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-600'
      }`}>
        <div className="terminal-header flex items-center justify-between p-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="ml-3 text-xs text-gray-400">
            {os === 'windows' ? 'script.ps1' : 'script.sh'}
          </div>
          
          <div className="flex-1"></div>
        </div>
        
        <div className="terminal-body">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[300px] p-4 font-mono text-sm bg-terminal-bg text-terminal-text focus:outline-none"
            spellCheck={false}
            wrap="off"
            aria-invalid={!!error}
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <p>Tips:</p>
        <ul className="list-disc list-inside ml-2 mt-1">
          <li>Use <strong>Tab</strong> to insert spaces</li>
          <li>Include comments to explain your script</li>
          <li>Use appropriate error handling</li>
          <li>Consider safety checks before destructive operations</li>
        </ul>
      </div>
    </div>
  );
};

export default ScriptCodeEditor;