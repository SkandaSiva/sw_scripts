
var CACHE_NAME = 'cache1';

self.addEventListener('fetch', function(event) {

    if(event.request.url.indexOf('static.partyking.org') > -1 || event.request.url.indexOf('assets.partyking.org') > -1 || event.request.url.indexOf('cdn.partykungen.se') > -1) {
       event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            // Cache hit - return response
            if (response) {
              return response;
            }

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
              function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }

                var responseToCache = response.clone();

                event.request.mode = 'cors';

                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });

                return response;
              }
            );
          })
      );
    }

});