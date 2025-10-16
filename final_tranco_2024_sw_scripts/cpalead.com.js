const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
    '/logo.png',
    '/dark_logo_cpalead.webp',
    '/offline.html',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
            .then(response => response || caches.match('/offline.html'))
    );
});