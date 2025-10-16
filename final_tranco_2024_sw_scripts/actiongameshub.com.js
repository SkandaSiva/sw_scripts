const CACHE_NAME = 'offline';
const OFFLINE_URL = '/offline.html';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
    debug: false,
});

// Demonstrates using default cache
/*
workbox.routing.registerRoute(
    new RegExp('https://assets\\..*\\.com\/.*\\.(?:js)'),
    new workbox.strategies.NetworkFirst(),
);
*/

workbox.routing.registerRoute(
    new RegExp('/.*\\.(?:css)'),
    new workbox.strategies.NetworkFirst(),
);

/*workbox.routing.registerRoute(
    new RegExp('https://assets\\..*\\.com\/.*\\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.cacheableResponse.CacheableResponse({
                statuses: [0,200],
                headers: {
                    'X-Is-Cacheable': 'true',
                },
            }),
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 99,
                maxAgeSeconds: 60 * 60 * 24 * 3, // 3 Days
            }),
        ],
    }),
);*/

self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');
    return event.waitUntil(self.skipWaiting()) //跳过等待
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(self.clients.claim());

    // Tell the active service worker to take control of the page immediately.

});

/*
self.addEventListener('fetch', function(event) {
    // console.log('[Service Worker] Fetch', event.request.url);
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                let networkResponse;
                event.waitUntil(async function (){
                    networkResponse = await fetch(event.request);
                })
                return networkResponse;
            } catch (error) {
                console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        })());
    }
});
*/
