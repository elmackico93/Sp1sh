// Sp1sh Advanced Service Worker
// Combines the expertise of caching strategies by Kevin Mitnick, Bill Gates, and Linus Torvalds

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `sp1sh-cache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sp1sh-runtime-${CACHE_VERSION}`;
const STATIC_CACHE = `sp1sh-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `sp1sh-images-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/favicon.ico',
  '/site.webmanifest',
  '/scripts/script-1', // Popular routes pre-cached
  '/emergency'
];

// Static assets that rarely change
const STATIC_ASSETS = [
  '/fonts/',
  '/optimized/'
];

// Helper function to determine request types
const isImage = (url) => /\.(jpe?g|png|gif|svg|webp|avif)$/i.test(new URL(url).pathname);
const isStaticAsset = (url) => {
  const { pathname } = new URL(url);
  return STATIC_ASSETS.some(asset => pathname.startsWith(asset));
};
const isApiRequest = (url) => new URL(url).pathname.startsWith('/api/');
const isHtmlRequest = (url) => {
  const { pathname } = new URL(url);
  return !pathname.match(/\.[a-z]{2,4}$/i) || pathname.endsWith('.html');
};

// Install event - precache important assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(PRECACHE_ASSETS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, STATIC_CACHE, IMAGE_CACHE];
  
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

// Fetch event - implement advanced strategies based on resource type
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // Strategy 1: Network-first for API requests (most fresh data)
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
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
  
  // Strategy 2: Cache-first for static assets (faster loading)
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response immediately
            return cachedResponse;
          }
          
          // If not in cache, fetch from network and cache
          return fetch(event.request)
            .then((response) => {
              if (!response.ok) return response;
              
              // Cache the fetched response
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            });
        })
    );
    return;
  }
  
  // Strategy 3: Special strategy for images (long cache, stale-while-revalidate)
  if (isImage(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Start network fetch
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              // Update cache with fresh image
              caches.open(IMAGE_CACHE)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
                
              return networkResponse;
            })
            .catch(() => {
              // If network fetch fails, return cached response
              // or null if no cached response (will be handled later)
              return cachedResponse;
            });
            
          // Return cached response immediately if exists
          // otherwise wait for network response
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Strategy 4: Network-first with fallback for HTML pages
  if (isHtmlRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, clonedResponse);
            });
              
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If no cached version, show offline page
              return caches.match('/offline');
            });
        })
    );
    return;
  }
  
  // Strategy 5: Stale-while-revalidate for all other requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Start fetch from network in background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
               
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return cached response or error
            return cachedResponse || new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
           
        // Return cached response immediately if exists
        // otherwise wait for network response
        return cachedResponse || fetchPromise;
      })
  );
});

// Register event handler for messages from client
self.addEventListener('message', (event) => {
  // Handle skip waiting message to activate updated service worker immediately
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle cache clear requests
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log("All caches cleared");
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true });
        }
      })
    );
  }
});

// Optional cache cleanup function - remove old/expired items
const cleanupCache = async () => {
  const now = Date.now();
  const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    // Skip the static cache - these assets should persist
    if (cacheName === STATIC_CACHE) continue;
    
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (!response) continue;
      
      // Check if the cached response has a date header
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const cacheTime = new Date(dateHeader).getTime();
        if (now - cacheTime > MAX_AGE) {
          // Remove items older than MAX_AGE
          cache.delete(request);
        }
      }
    }
  }
};

// Set up periodic cache cleanup when available
if ('periodicSync' in self.registration) {
  self.registration.periodicSync.register('cache-cleanup', {
    minInterval: 24 * 60 * 60 * 1000 // Once per day
  }).catch(err => {
    console.error('Failed to register periodic sync:', err);
  });
  
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-cleanup') {
      event.waitUntil(cleanupCache());
    }
  });
}
