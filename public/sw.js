// Service Worker for Sp1sh

const CACHE_NAME = 'sp1sh-cache-v1';
const RUNTIME_CACHE = 'sp1sh-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/images/logo.svg',
  '/favicon.ico',
  '/site.webmanifest'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if request is for an API route
const isApiRequest = (url) => {
  const { pathname } = new URL(url);
  return pathname.startsWith('/api/');
};

// Helper function to determine if request is for a script page
const isScriptPage = (url) => {
  const { pathname } = new URL(url);
  return pathname.startsWith('/scripts/');
};

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests with network-first strategy
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache response for future requests
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache for offline functionality
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For script pages - use stale-while-revalidate for fast subsequent page loads
  if (isScriptPage(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response.ok) return response;
              
              // Cache the new response for next time
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // If fetch fails (offline), we already returned cached response or will fall through
            });
            
          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // For all other requests - use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return from cache immediately
          // But also update cache in background
          const fetchPromise = fetch(event.request)
            .then((response) => {
              // Don't cache non-successful responses
              if (!response.ok) return;
              
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            })
            .catch(() => {
              // Offline - already served from cache, so ignore failures
            });
            
          // Start background update but don't wait for it
          event.waitUntil(fetchPromise);
          
          // Return cached response
          return cachedResponse;
        }
        
        // Not in cache - get from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) return response;
            
            // Cache a copy for next time
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Offline and not cached - fallback to offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            
            // For other resources, just fail
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});
