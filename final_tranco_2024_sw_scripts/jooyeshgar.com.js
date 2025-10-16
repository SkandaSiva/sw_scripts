var PRECACHE = 'precache-v1';
var PRECACHE_URLS = [
  // '/about',//be edited
];

const RUNTIME = 'runtime';

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});


self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
});
  

self.addEventListener('fetch', event => {
if (event.request.url.startsWith(self.location.origin)) {
    var check_url = false ;
    for (var x; x < PRECACHE_URLS.length; x++) {
      if ( event.request.url.indexOf( PRECACHE_URLS[x] ) !== -1 ) {
        check_url = true ;
      }
    }
    
    if (!check_url) {
      return false;
    }
    event.respondWith(
    caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
            return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
                return cache.put(event.request, response.clone()).then(() => {
                return response;
                });
            });
        });
    })
    );
}
});