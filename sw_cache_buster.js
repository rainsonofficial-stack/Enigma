// New file: sw_cache_buster.js
// Use a unique name to ensure the browser fetches this new file immediately.
const CACHE_BUST_NAME = 'cache-buster-v99'; 

// 1. Install Event: Register the new cache name (though it won't store anything)
self.addEventListener('install', (event) => {
  console.log('[Cache Buster] Installing service worker and claiming clients.');
  event.waitUntil(
    caches.open(CACHE_BUST_NAME).then((cache) => {
      // Clean up old caches on install
      return caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
          if (key !== CACHE_BUST_NAME) {
            console.log('[Cache Buster] Deleting old cache:', key);
            return caches.delete(key);
          }
        }));
      });
    }).then(() => self.skipWaiting()) // Force the new worker to activate immediately
  );
});

// 2. Activate Event: Ensure the new worker takes control immediately
self.addEventListener('activate', (event) => {
    console.log('[Cache Buster] Activating service worker and claiming clients.');
    event.waitUntil(self.clients.claim());
});

// 3. Fetch Event: Intercept network requests and only fetch (no caching)
self.addEventListener('fetch', (event) => {
  // This worker acts as a pass-through and doesn't cache anything,
  // ensuring the browser always gets the latest manifest.json from the network.
  event.respondWith(fetch(event.request));
});
