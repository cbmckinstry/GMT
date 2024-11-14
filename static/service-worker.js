const CACHE_NAME = 'clustering-app-v1';
const urlsToCache = [
    '/',
    '/offline.html',    // Cache the root route
    '/static/service-worker.js',    // Cache the service worker itself
    // Add any other static files or routes needed for your app to function offline
];

self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching resources...');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');  // Serve fallback offline page
                }
            });
        })
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