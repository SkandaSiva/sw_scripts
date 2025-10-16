'use strict';

var version = 'v13::';
var offline = [
    'offline.html',
    'offline-en.html'
];

function createCacheBustedRequest(url) {
      let request = new Request(url, {cache: 'reload'});
      // See https://fetch.spec.whatwg.org/#concept-request-mode
      // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
      // if the cache: 'reload' option had any effect.
      if ('cache' in request) {
        return request;
      }

      // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
      let bustedUrl = new URL(url, self.location.href);
      bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
      return new Request(bustedUrl);
}

self.addEventListener('install', event => {
    event.waitUntil(
        
        caches
            /* You can open a cache by name, and this method returns a promise. We use
               a versioned cache name here so that we can remove old cache entries in
               one fell swoop later, when phasing out an older service worker.
            */
          .open(version + 'offline')
          .then(function(cache) {
            /* After the cache is opened, we can fill it with the offline fundamentals.
               The method below will add all resources in `offlineFundamentals` to the
               cache, after making requests for them.
            */
            return cache.addAll(offline);
          })
          .then(function() {
            //console.log('WORKER: install completed');
          })
    );
});


self.addEventListener('activate', event => {

    event.waitUntil(
    caches
    // This method returns a promise which will resolve to an array of available cache keys.
        .keys()
        .then(function (keys) {
            // We return a promise that settles when all outdated caches are deleted.
            return Promise.all(
                keys
                .filter(function (key) {
                    // Filter by keys that don't start with the latest version prefix.
                    return !key.startsWith(version);
                })
                .map(function (key) {
                    // Return a promise that's fulfilled when each outdated cache is deleted.
                    return caches.delete(key);
                })
            );
        })
        .then(function() {
            //console.log('WORKER: activate completed.');
        })
    );
});


self.addEventListener('fetch', event => {

    if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {

        //console.log('Handling fetch event for', event.request.url);
        event.respondWith(
            fetch(event.request).catch(error => {

                //console.log('Fetch failed; returning offline page instead.', error);
                var target = (event.request.url.includes('/en/')) ? 'offline-en.html' : 'offline.html';
                return caches.match(target);
            })
        );
    }

});