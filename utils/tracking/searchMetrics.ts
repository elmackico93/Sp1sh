/**
 * Search Metrics Tracking
 * Tracks user search patterns to improve search experience
 * All data is anonymized and only used for enhancing search results
 */

interface SearchEvent {
  term: string;
  timestamp: number;
  resultsCount: number;
  selectedResult?: string;
  timeToSelect?: number;
}

// In-memory storage (would be replaced with proper analytics in production)
const searchEvents: SearchEvent[] = [];
const MAX_STORED_EVENTS = 100;

/**
 * Tracks a search event
 */
export const trackSearch = (term: string, resultsCount: number): number => {
  const timestamp = Date.now();
  
  // Store search event
  const event: SearchEvent = {
    term,
    timestamp,
    resultsCount
  };
  
  // Add to events array, keeping only last MAX_STORED_EVENTS
  searchEvents.push(event);
  if (searchEvents.length > MAX_STORED_EVENTS) {
    searchEvents.shift();
  }
  
  return timestamp;
};

/**
 * Tracks when a search result is selected
 */
export const trackResultSelection = (searchTimestamp: number, resultId: string): void => {
  // Find the search event
  const eventIndex = searchEvents.findIndex(event => event.timestamp === searchTimestamp);
  if (eventIndex !== -1) {
    // Update the event with selection data
    searchEvents[eventIndex].selectedResult = resultId;
    searchEvents[eventIndex].timeToSelect = Date.now() - searchTimestamp;
  }
};

/**
 * Returns popular search terms
 */
export const getPopularSearchTerms = (limit: number = 10): string[] => {
  // Count occurrences of each search term
  const termCounts: Record<string, number> = {};
  searchEvents.forEach(event => {
    if (event.term in termCounts) {
      termCounts[event.term]++;
    } else {
      termCounts[event.term] = 1;
    }
  });
  
  // Sort terms by frequency
  return Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term]) => term);
};

/**
 * Returns recent searches
 */
export const getRecentSearches = (limit: number = 5): string[] => {
  // Get unique terms from recent to old
  const uniqueTerms: string[] = [];
  
  // Iterate from newest to oldest
  for (let i = searchEvents.length - 1; i >= 0; i--) {
    const term = searchEvents[i].term;
    if (!uniqueTerms.includes(term)) {
      uniqueTerms.push(term);
      if (uniqueTerms.length >= limit) break;
    }
  }
  
  return uniqueTerms;
};
