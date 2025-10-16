let staticCacheName = "pwa-v" + new Date().getTime();
let filesToCache = [
    '/css/frontend.css',
    '/css/restaurant-page.css',
    '/js/frontend.js',
    '/js/app.v2.js',
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
];

// Cache on install
self.addEventListener("install", event => {
    event.waitUntil(caches.open(staticCacheName)
        .then(cache => {
            return cache.addAll(filesToCache);
        })
        .then(self.skipWaiting()));
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames
            .filter(cacheName => (cacheName.startsWith("pwa-")))
            .filter(cacheName => (cacheName !== staticCacheName))
            .map(cacheName => caches.delete(cacheName)));
    }));
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
        .catch(() => {
            return caches.match('offline');
        }))
});
