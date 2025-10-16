'use strict';

var cacheVersion = 101;
var currentCache = {
    offline: 'vtc-' + cacheVersion
};

let precacheUrls = [];
let offlineUrl = '/offline';
precacheUrls.push(offlineUrl);

/* INSTALL */
this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(currentCache.offline).then(function (cache) {
            return cache.addAll(precacheUrls);
        })
    );
});

/* FETCH */
this.addEventListener('fetch', function (event) {
    if (navigator.onLine === true || event.request.method !== 'GET' || !event.request.headers.get('accept').includes('text/html')) {
        return;
    }
    if (event.request.mode === 'navigate' && navigator.onLine === false || (navigator.onLine === false && event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        /* Respond with offline page if its text or html user tries to load */
        event.respondWith(
            fetch(event.request.url).catch(function (error) {
                return caches.match(offlineUrl);
            })
        );
    } else {
        /* Try to respond out of the regular cache */
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});