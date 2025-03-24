import { debounce } from 'lodash';

// Set a 150ms debounce delay for smooth real-time search
export const debouncedSearch = debounce((
  searchTerm: string,
  callback: (results: any[]) => void,
  searchFunction: (term: string) => Promise<any[]>
) => {
  if (searchTerm.length < 2) {
    callback([]);
    return;
  }
  
  searchFunction(searchTerm)
    .then(results => {
      callback(results);
    })
    .catch(err => {
      console.error('Search error:', err);
      callback([]);
    });
}, 150);

// Highlight matching text in search results
export const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) {
    return { parts: [{ text, isMatch: false }] };
  }
  
  // Escape special regex characters
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex to match the query (case insensitive)
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  
  // Split the text by regex matches
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Find all matches and build the parts array
  while ((match = regex.exec(text)) !== null) {
    // Add non-matching part before the match
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isMatch: false
      });
    }
    
    // Add the matching part
    parts.push({
      text: match[0],
      isMatch: true
    });
    
    lastIndex = regex.lastIndex;
  }
  
  // Add any remaining text after the last match
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isMatch: false
    });
  }
  
  return { parts };
};

// Group search results by categories
export const groupResultsByCategory = (results: any[]) => {
  return results.reduce((groups: Record<string, any[]>, item) => {
    const category = item.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

// Add keyboard navigation support
export const useKeyboardNavigation = (
  resultsLength: number,
  isOpen: boolean,
  setHighlightedIndex: (index: number) => void,
  highlightedIndex: number,
  onSelect: (index: number) => void,
  onClose: () => void
) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen || resultsLength === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((highlightedIndex + 1) % resultsLength);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((highlightedIndex - 1 + resultsLength) % resultsLength);
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          onSelect(highlightedIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };
  
  return handleKeyDown;
};
