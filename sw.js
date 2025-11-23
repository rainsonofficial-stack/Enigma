const CACHE_NAME = 'magician-v2'; // Changed version to force cache update
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // Ensure you add paths to your image files here
];

// Install event: cache all necessary assets
self.addEventListener('install', event => {
    self.skipWaiting(); // Critical: Forces the waiting service worker to become the active worker
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event: clean up old caches and claim clients
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Claim clients immediately after activation
            self.clients.claim()
        ])
    );
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
