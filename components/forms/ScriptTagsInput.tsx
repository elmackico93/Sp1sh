import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

interface ScriptTagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string;
  suggestedTags?: string[];
}

export const ScriptTagsInput: React.FC<ScriptTagsInputProps> = ({
  tags,
  onChange,
  error,
  suggestedTags = ['monitoring', 'performance', 'security', 'backup', 'maintenance', 'networking', 'automation', 'cleanup', 'emergency', 'optimization']
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestedTags
        .filter(tag => 
          !tags.includes(tag) && 
          tag.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      // Show popular tags when input is empty
      setFilteredSuggestions(
        suggestedTags
          .filter(tag => !tags.includes(tag))
          .slice(0, 5)
      );
    }
  }, [inputValue, tags, suggestedTags]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!showSuggestions) {
      setShowSuggestions(true);
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      onChange(newTags);
      setInputValue('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Press Enter or comma to add a tag
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tags.length} / 10 tags
        </p>
      </div>
      
      <div className={`flex flex-wrap gap-2 p-3 rounded-md border ${
        error 
          ? 'border-red-500 dark:border-red-500' 
          : 'border-gray-300 dark:border-gray-600'
      } bg-white dark:bg-gray-700 min-h-[80px]`}>
        {/* Existing tags */}
        {tags.map(tag => (
          <div 
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary/60 hover:text-primary focus:outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
        
        {/* Tag input */}
        <div className="relative flex-grow min-w-[150px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            className="w-full py-1 pl-2 pr-8 bg-transparent focus:outline-none text-gray-900 dark:text-white"
            placeholder={tags.length === 0 ? "Add tags..." : ""}
            disabled={tags.length >= 10}
          />
          
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                addTag(inputValue);
                inputRef.current?.focus();
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark focus:outline-none"
              aria-label="Add tag"
            >
              <FiPlus size={18} />
            </button>
          )}
          
          {/* Tag suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10"
            >
              <div className="p-1 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                Suggested Tags
              </div>
              <div className="p-1">
                {filteredSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {/* Popular Tags */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.slice(0, 8).map(suggestion => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              disabled={tags.includes(suggestion) || tags.length >= 10}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                tags.includes(suggestion)
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptTagsInput;