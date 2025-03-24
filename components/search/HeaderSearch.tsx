import React from 'react';
import { EnhancedSearch } from './EnhancedSearch';

/**
 * HeaderSearch - A compact search component for the site header
 * 
 * This is a specialized version of the EnhancedSearch component
 * that's optimized for the header navigation, with a smaller footprint
 * and fewer visible options.
 */
export const HeaderSearch: React.FC = () => {
  return (
    <EnhancedSearch 
      placeholder="Quick search scripts..."
      maxResults={5}
      variant="compact"
      className="w-full"
    />
  );
};

export default HeaderSearch;