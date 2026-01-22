const CACHE_NAME = 'os-lockscreen-v1';
// List all files needed to run your app offline
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'large_dictionary.js',
  'home.jpg',
  'manifest.json'
  // Add icons or other CSS files if you have them
];

// INSTALL: Save files to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file OR fetch from network
      return cachedResponse || fetch(event.request);
    })
  );
});
