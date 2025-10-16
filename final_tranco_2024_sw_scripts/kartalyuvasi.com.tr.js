var CACHE_NAME = 'kartalyuvası_v2';

importScripts('https://sw.revotas.com/trc/api/service-worker.js');

var urlsToCache = [
 
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
});
