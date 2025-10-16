'use strict';
var PREFIX = 'rv';
var HASH = 'service-worker'; // Computed at build time.
var OFFLINE_CACHE = `${PREFIX}-${HASH}`;
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then(function(cache) {
      return cache.addAll([
        '/offline'
      ]); // Computed at build time.
    })
  );
});
self.addEventListener('fetch', function(event) {
  if (event.request.mode == 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function(exception) {
        return caches.open(OFFLINE_CACHE).then(function(cache) {
          return cache.match('/offline');
        });
      })
    );
  } 
});
