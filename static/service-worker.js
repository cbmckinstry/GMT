const CACHE_NAME = 'clustering-app-v1';
const urlsToCache = [
    '/',                      // Root route (your HTML)
    '/static/service-worker.js' // Cache the service worker itself
];

self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching resources...');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch request for:', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Serving from cache:', response);
                    return response;
                }
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request);
            })
            .catch(() => caches.match('/')) // Fall back to root if network fails
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});