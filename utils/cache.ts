/**
 * Advanced caching utilities for Sp1sh
 */

// In-memory cache store
const MEMORY_CACHE: Record<string, { data: any; expiry: number }> = {};

// Browser storage based cache
export const storageCache = {
  // Set item with expiration
  set: (key: string, data: any, ttlSeconds: number = 3600): void => {
    try {
      const expiry = Date.now() + (ttlSeconds * 1000);
      const item = { data, expiry };
      localStorage.setItem(`sp1sh_cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  },
  
  // Get item and check expiration
  get: <T>(key: string): T | null => {
    try {
      const cachedItem = localStorage.getItem(`sp1sh_cache_${key}`);
      if (!cachedItem) return null;
      
      const item = JSON.parse(cachedItem);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(`sp1sh_cache_${key}`);
        return null;
      }
      
      return item.data as T;
    } catch (error) {
      console.error('Error getting cached item:', error);
      return null;
    }
  },
  
  // Remove item
  remove: (key: string): void => {
    localStorage.removeItem(`sp1sh_cache_${key}`);
  },
  
  // Clear all cache
  clear: (): void => {
    // Only clear sp1sh_cache_ prefixed items
    Object.keys(localStorage)
      .filter(key => key.startsWith('sp1sh_cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

// Memory cache for faster access
export const memoryCache = {
  // Set item with expiration
  set: <T>(key: string, data: T, ttlSeconds: number = 60): void => {
    const expiry = Date.now() + (ttlSeconds * 1000);
    MEMORY_CACHE[key] = { data, expiry };
  },
  
  // Get item and check expiration
  get: <T>(key: string): T | null => {
    const cachedItem = MEMORY_CACHE[key];
    if (!cachedItem) return null;
    
    if (Date.now() > cachedItem.expiry) {
      delete MEMORY_CACHE[key];
      return null;
    }
    
    return cachedItem.data as T;
  },
  
  // Remove item
  remove: (key: string): void => {
    delete MEMORY_CACHE[key];
  },
  
  // Clear all cache
  clear: (): void => {
    Object.keys(MEMORY_CACHE).forEach(key => {
      delete MEMORY_CACHE[key];
    });
  }
};

// SWR fetcher with cache
export const cachedFetcher = async <T>(
  url: string, 
  options?: RequestInit, 
  ttlSeconds: number = 3600
): Promise<T> => {
  const cacheKey = `fetch_${url}_${JSON.stringify(options || {})}`;
  
  // Try memory cache first (fastest)
  const memCachedData = memoryCache.get<T>(cacheKey);
  if (memCachedData) return memCachedData;
  
  // Try storage cache next
  const storageCachedData = storageCache.get<T>(cacheKey);
  if (storageCachedData) {
    // Refresh memory cache
    memoryCache.set(cacheKey, storageCachedData, 60);
    return storageCachedData;
  }
  
  // Fetch fresh data
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the fresh data
  memoryCache.set(cacheKey, data, 60); // Short TTL for memory
  storageCache.set(cacheKey, data, ttlSeconds); // Longer TTL for storage
  
  return data as T;
};

// Service worker registration for additional caching
export const registerServiceWorker = (): void => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
};
