var staticCacheName = "pwa-v2" + new Date().getTime();
var filesToCache = [
    '/css/main.css',
    '/js/principal.js',
    '/js/login.js',
    '/js/profile.js',
    '/js/portafolio.js',
    '/js/novelties.js',
    '/js/retos/upload-photo.js',
    '/js/retos/capture-photo.js',
    '/img/icons/pwa-assets/icon-72x72.png',
    '/img/icons/pwa-assets/icon-96x96.png',
    '/img/icons/pwa-assets/icon-128x128.png',
    '/img/icons/pwa-assets/icon-144x144.png',
    '/img/icons/pwa-assets/icon-152x152.png',
    '/img/icons/pwa-assets/icon-192x192.png',
    '/img/icons/pwa-assets/icon-384x384.png',
    '/img/icons/pwa-assets/icon-512x512.png',
];


// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});