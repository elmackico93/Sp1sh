import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  prompt: string;
  type?: 'text' | 'password';
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (command: string) => void;
  history?: string[];
  historyIndex?: number;
  setHistoryIndex?: (index: number) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  prompt,
  type = 'text',
  placeholder = '',
  disabled = false,
  onSubmit,
  history = [],
  historyIndex = -1,
  setHistoryIndex = () => {}
}) => {
  const [command, setCommand] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Common terminal commands for autocomplete
  const commonCommands = ['help', 'clear', 'status', 'back', 'cancel', 'register', 'signup', 'accept', 'view-terms', 'view-privacy'];
  
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
      setShowAutocomplete(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCommand = e.target.value;
    setCommand(newCommand);
    
    // Show autocomplete if the command is not empty
    if (newCommand.trim()) {
      const options = commonCommands.filter(cmd => 
        cmd.startsWith(newCommand.toLowerCase()) && cmd !== newCommand.toLowerCase()
      );
      
      setAutocompleteOptions(options);
      setShowAutocomplete(options.length > 0);
      setAutocompleteIndex(0);
    } else {
      setShowAutocomplete(false);
    }
  };
  
  // Handle clicks on the container to focus the input
  const handleContainerClick = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  };
  
  // Handle keyboard events for history and autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow up/down for command history
    if (e.key === 'ArrowUp' && history.length > 0) {
      e.preventDefault();
      const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      if (newIndex >= 0 && newIndex < history.length) {
        setCommand(history[history.length - 1 - newIndex]);
        setShowAutocomplete(false);
      }
    } else if (e.key === 'ArrowDown' && historyIndex > -1) {
      e.preventDefault();
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setCommand(history[history.length - 1 - newIndex]);
      } else {
        setCommand('');
      }
      setShowAutocomplete(false);
    } 
    // Handle Tab for autocompletion
    else if (e.key === 'Tab' && showAutocomplete) {
      e.preventDefault();
      const selected = autocompleteOptions[autocompleteIndex];
      if (selected) {
        setCommand(selected);
        setShowAutocomplete(false);
      }
    }
    // Handle Escape for clearing the input
    else if (e.key === 'Escape') {
      e.preventDefault();
      setCommand('');
      setShowAutocomplete(false);
      setHistoryIndex(-1);
    }
    // Navigate through autocomplete options
    else if (e.key === 'ArrowRight' && showAutocomplete) {
      e.preventDefault();
      setAutocompleteIndex((autocompleteIndex + 1) % autocompleteOptions.length);
    }
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`flex items-center ${disabled ? 'opacity-70' : 'cursor-text'} relative`}
    >
      <span className="text-terminal-green font-mono text-sm md:text-base">{prompt}</span>
      <form onSubmit={handleSubmit} className="flex-1 ml-2 relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type={type}
            value={command}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-mono ${
              type === 'password' ? 'text-terminal-text' : 'text-terminal-text'
            }`}
            placeholder={placeholder}
            autoComplete={type === 'password' ? 'current-password' : 'off'}
          />
          
          {/* Custom cursor for terminal-like experience */}
          {command.length === 0 && cursorVisible && !disabled && (
            <span className="absolute left-0 h-4 w-2 bg-terminal-text animate-pulse"></span>
          )}
          
          {/* End cursor when there's text */}
          {command.length > 0 && cursorVisible && !disabled && (
            <span className="inline-block h-4 w-2 bg-terminal-text animate-pulse ml-0.5"></span>
          )}
          
          {/* Autocomplete popup */}
          {showAutocomplete && autocompleteOptions.length > 0 && (
            <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {autocompleteOptions.map((option, index) => (
                <div 
                  key={option}
                  className={`px-3 py-1.5 text-sm cursor-pointer ${
                    index === autocompleteIndex 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setCommand(option);
                    setShowAutocomplete(false);
                    inputRef.current?.focus();
                  }}
                >
                  {option}
                </div>
              ))}
              <div className="bg-gray-700 px-2 py-1 text-xs text-gray-400 border-t border-gray-600">
                Tab to autocomplete • ESC to clear • ↑↓ history
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommandInput;