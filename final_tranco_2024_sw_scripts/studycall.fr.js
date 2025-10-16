var CACHE_VERSION = 'v1';
var CACHE_NAME = CACHE_VERSION + ':sw-cache-';

function onInstall(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function prefill(cache) {
      return cache.addAll([
        // make sure serviceworker.js is not required by application.js
        // if you want to reference application.js from here
        '/assets/application-52c472a3916cee810ece8943bf1cde8095e896334e9aae61fa6c15c3146cacda.js', '/assets/application-3639a0844c7a6e953ec1984690d6abf389e406185dd98139551952219e454fab.css', '/offline.html',
      ]);
    })
  );
}

function onActivate(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          return cacheName.indexOf(CACHE_VERSION) !== 0;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
}

// Borrowed from https://github.com/TalAter/UpUp
function onFetch(event) {
  event.respondWith(
    // try to return untouched request from network first
    fetch(event.request).catch(function() {
      // if it fails, try to return request from the cache
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        // if not found in cache, return default offline content for navigate requests
        if (event.request.mode === 'navigate' ||
          (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
          return caches.match('/offline.html');
        }
      })
    })
  );
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);

self.addEventListener('push', (event) => {
    const json = event.data.json()
    let title = json.title
    let body = json.body
    let tag = json.tag
    let icon = json.icon
    event.waitUntil(self.registration.showNotification(title, { body, icon, tag }))
})

;
