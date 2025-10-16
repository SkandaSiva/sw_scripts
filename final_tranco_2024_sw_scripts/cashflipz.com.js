var CACHE_NAME = 'cashflipz';
var offlinePage = 'offline.html'

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.add(offlinePage);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(async error => {
      console.log("Fetch failed; returning offline page instead.", error);
      return caches.open(CACHE_NAME).then(cache => {
        return cache.match(offlinePage);
      });
    })
  );
});