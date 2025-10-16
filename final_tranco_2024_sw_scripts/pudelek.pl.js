importScripts('https://samito-webpush.wpcdn.pl/push_manager/sw.js');

if (self.navigator.platform !== 'iPhone') {
  var CACHE_NAME = 'pudelek-cache-v2';
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(['/']);
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    if (event.request.destination !== 'font') {
      return
    }
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();
          return fetch(fetchRequest).then(
            function(response) {
              if(!response || response.status !== 200) {
                return response;
              }

              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
              return response;
            }
          );
        }
      )
    );
  });
}
