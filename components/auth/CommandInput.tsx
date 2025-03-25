import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  prompt: string;
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (command: string) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  prompt,
  type = 'text',
  placeholder = '',
  disabled = false,
  onSubmit
}) => {
  const [command, setCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Focus the input when mounted
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(interval);
  }, []);

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (command.trim() && !disabled) {
      onSubmit(command);
      setCommand('');
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };
  
  // Handle clicks on the container to focus the input
  const handleContainerClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`flex items-center ${disabled ? 'opacity-70' : 'cursor-text'}`}
    >
      <span className="text-terminal-green font-mono">{prompt}</span>
      <form onSubmit={handleSubmit} className="flex-1 ml-2">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type={type}
            value={command}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-mono ${
              type === 'password' ? 'text-terminal-text' : 'text-terminal-text'
            }`}
            placeholder={placeholder}
            autoComplete={type === 'password' ? 'current-password' : 'username'}
          />
          
          {/* Custom cursor for terminal-like experience */}
          {command.length === 0 && cursorVisible && !disabled && (
            <span className="absolute left-0 h-4 w-2 bg-terminal-text animate-pulse"></span>
          )}
          
          {/* End cursor when there's text */}
          {command.length > 0 && cursorVisible && !disabled && (
            <span className="inline-block h-4 w-2 bg-terminal-text animate-pulse ml-0.5"></span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommandInput;