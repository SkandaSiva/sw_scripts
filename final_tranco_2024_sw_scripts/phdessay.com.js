importScripts('https://push.esputnik.com/service-worker.js');

var ver = "v0.1";

self.addEventListener('install', function(t) {
    t.waitUntil(
        caches.open(ver)
            .then(function(cache) {
                return cache.addAll([
                    "/offline/"
                ]);
            })
    );
});

self.addEventListener('activate', function(t) {
    t.waitUntil(caches.keys().then(function(t) {
        return Promise.all(t.map(function(t) {
            if (-1 === ver.indexOf(t)) {
                return caches.delete(t);
            }
        }))
    }))
});

self.addEventListener('fetch', function(t) {
    // Always bypass for range requests, due to browser bugs
    if (t.request.headers.has('range')) return;
    t.respondWith(
        caches.match(t.request)
            .then(function(response) {
                return response || fetch(t.request);
            })
            .catch(function() {
                return caches.match('/offline/');
            })
    );
});