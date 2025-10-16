const CACHE_NAME = 'px-website-cache-v4';
const OFFLINE_URL = '/offline.html';
const CACHED_URLS = [OFFLINE_URL];

self.addEventListener("install", function (event) {
        console.log('[ServiceWorker] Install');
        event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHED_URLS)).then(self.skipWaiting()));
    }
);

self.addEventListener("activate", function (event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("px-website-cache")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', function (event) {
    if (navigator.onLine) {
        return;
    }
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith((async () => {
            try {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
                if (event.request.mode === 'navigate') {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                }
            }
        })());
    }
});