importScripts('cache-polyfill.js');

caches.delete(['v3-cache']);
caches.delete(['v4-cache']);
caches.delete(['v5-cache']);

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open('v6-cache').then(function(cache) {
      return cache.addAll([
           '/banking'
         ]);
    })
  );

});


self.addEventListener('activate', function(event) {
  var cacheAllowlist = ['v6-cache'];

  event.waitUntil(
    caches.forEach(function(cache, cacheName) {
      if (cacheAllowlist.indexOf(cacheName) == -1) {
        return caches.delete(cacheName);
      }
    })
  );
});



self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );

});
