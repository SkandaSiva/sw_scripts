const CACHE_NAME = 'simple-cache-v1';
const urlsToCache = [];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return caches.delete(CACHE_NAME);
        // return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
  // console.log('request', event.request)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // console.log('response', response)
        if(response) {
          console.log('returning response')
          // return response;
          return fetch(event.request);
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  // console.log('activate')
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        // console.log('cacheNames', cacheNames)
        return Promise.all(
          cacheNames.map(function(cacheName) {
            // console.log('delete cache', cacheName)
            return caches.delete(cacheName);
          })
        );
      })
  );
});