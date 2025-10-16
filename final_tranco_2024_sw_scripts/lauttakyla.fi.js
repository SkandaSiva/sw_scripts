var STATIC_CACHE = 'static-cache-v44';
    var urlsToCache = [
              'https://lauttakyla.fi/site/templates/scripts/fastindex.js?v=44',
              'https://lauttakyla.fi/site/templates/scripts/bundle.js?v=44',
              'https://lauttakyla.fi/site/templates/styles/style.css?v=44',
              'https://lauttakyla.fi/site/templates/img/Lauttakyla_logo.svg?v=44',
              'https://lauttakyla.fi/site/templates/img/favicon/android-chrome-192x192.png?v=44',
          ];
    
    self.addEventListener('install', function (event) {
      // Perform install steps
      event.waitUntil(
        caches.open(STATIC_CACHE)
          .then(function (cache) {
            return cache.addAll(urlsToCache);
          })
      );
    });
    
    self.addEventListener('activate', function(event) {
      console.log("activate")
      event.waitUntil(
        caches.keys().then(function(cacheNames) {
          for (var i in cacheNames) {
            if (cacheNames[i] != STATIC_CACHE) {
              caches.delete(cacheNames[i]);
            }
          }
        }),
        caches.open(STATIC_CACHE).then(function(cache) {
          return cache.keys().then(function(existingRequests) {
            return Promise.all(
              existingRequests.map(function(existingRequest) {
                if (urlsToCache.indexOf(existingRequest.url) < 0) {
                  return cache.delete(existingRequest);
                }
              })
            );
          });
        }).then(function() {
          return self.clients.claim();
        })
      );
    });
    
    self.addEventListener('fetch', function (event) {
      event.respondWith(
        caches.match(event.request)
          .then(function (response) {
            // Cache hit - return response
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
      );
    });