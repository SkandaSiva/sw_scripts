/* eslint-disable compat/compat */

var OFFLINE_PAGE = 'offline/index.html';
var OFFLINE_IMG = 'offline/offline.jpg';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('offline').then(function(cache) {
            return cache.addAll([OFFLINE_PAGE, OFFLINE_IMG]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    var request = event.request;

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(function() {
                return caches.match(OFFLINE_PAGE);
            })
        );
    } else if (event.request.url.includes(OFFLINE_IMG)) {
        event.respondWith(
            caches.match(request).then(function(response) {
                return response || fetch(request);
            })
        );
    }
});