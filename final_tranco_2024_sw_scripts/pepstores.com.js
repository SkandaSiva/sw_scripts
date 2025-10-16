/* PlaceHolder Service Worker for PWA functionality */


var cacheName = 'facade-serviceworker-cache';

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache =>
                cache.addAll([])
            ).then(() => self.skipWaiting())
    );
});

// Removing outdated caches
self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames
//                     .filter(function (cacheName) {
//                         return true;
//                     })
//                     .map(function (cacheName) {
//                         return caches.delete(cacheName);
//                     })
//             );
//         }).then(() => self.clients.claim())
//     );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', function (event) {
    // extend to use service worker
});