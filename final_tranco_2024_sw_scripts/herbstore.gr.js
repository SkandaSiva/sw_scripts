var CACHEABLE_FILES = [
  "/template/twilly/assets/fonts/icomoon/icomoon.css",
  "https://cdn.nagacommerce.com/templates/__master/js/common.min.js",
  "https://cdn.nagacommerce.com/templates/twilly/assets/js/plugins.min.js",
  "https://cdn.nagacommerce.com/templates/twilly/assets/js/app.min.js",
  "https://cdn.nagacommerce.com/templates/twilly/assets/js/modals.min.js",
  "https://cdn.nagacommerce.com/templates/twilly/assets/js/product.min.js",
  "https://cdn.nagacommerce.com/templates/twilly/assets/js/quicksearch.min.js"
];

const CACHE_NAME = 'nagacommerce-cache';
var CACHE_LIMIT = 50 * 1024 * 1024;

self.addEventListener('fetch', function(event) {
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response since it can only be consumed once
        let responseToCache = response.clone();

        // Check if adding the response to the cache will exceed the limit
        caches.open(CACHE_NAME).then(function(cache) {
          cache.keys().then(function(keys) {
            let cacheSize = 0;
            keys.forEach(function(request) {
              cache.match(request).then(function(response) {
                cacheSize += response.headers.get('content-length');
              });
            });

            // If adding the response to the cache will exceed the limit, remove the oldest cached resource
            if (cacheSize + responseToCache.headers.get('content-length') > CACHE_LIMIT) {
              let oldestRequest = keys[0];
              cache.delete(oldestRequest);
            }

            // Add the response to the cache
            cache.put(event.request, responseToCache);
          });
        });

        return response;
      });
    })
  );
});


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHEABLE_FILES);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(CACHE_NAME) && cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});