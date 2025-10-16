var CACHE_NAME = 'v3';
var urlsToCache = ['/offline.html', '/neterror2.html'];
self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['v3'];
    event.waitUntil(caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (cacheWhitelist.indexOf(key) === -1) {
                return caches.delete(key);
            }
        }));
    }));
});
self.addEventListener('fetch', function(event) {
    if (self.navigator.onLine === false && event.request.mode === 'navigate') {
        event.respondWith(async function() {
            return fetch(event.request).catch(() => caches.match('/offline.html'));
        }());
    } else if (event.request.url === self.location.origin + '/') {
        event.respondWith(async function() {
            event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
                cache.match('/neterror2.html').then(function(isCached) {
                    if (!isCached) {
                        cache.add('/neterror2.html');
                    }
                });
            }));
            return fetch(event.request).catch(() => caches.match('/neterror2.html'));
        }());
    }
});