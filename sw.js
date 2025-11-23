const CACHE_NAME = 'magician-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // Add any necessary icon files here later:
    // '/icon-192.png',
    // '/icon-512.png'
];

// Install event: cache all necessary assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and adding files...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: serve assets from cache, falling back to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Not in cache - fetch from network
                return fetch(event.request).catch(() => {
                    // Fallback for full offline mode if a requested resource isn't cached
                    // Since all required assets are in index.html, this is mostly a safety net.
                });
            })
    );
});
