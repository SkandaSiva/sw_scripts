var CACHE_VERSION = 'v1';
var CACHE_NAME = CACHE_VERSION + ':sw-cache-betbonanza.com';

self.addEventListener('install', function(event) {
  console.log('[Serviceworker]', "Installing!", event);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function prefill(cache) {
      return cache.addAll([
        '/assets/application-c3d789be79da6026461b02f756d571511a52569777c52d7ecc11e1856a66fa5a.js',
        '/assets/application-a715b8b6d37e3fc2555708f42bceaff1db8e7c21187bcf078e698e1b6d77aab8.css',
        '/offline.html'
      ]);
    })
  );
});

// Browser default for non-GET requests.
// For GET requests it tries to return a match in the cache,
// and falls back to the network.
self.addEventListener('fetch', (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)                                       // first, the network
      .catch(function fallback() {
        caches.match(event.request).then(function(response) {  // then, the cache
          response || caches.match("/offline.html");     // then, /offline cache
        })
      })
  );
});

const deleteCache = async key => {
  await caches.delete(key)
}

const deleteOldCaches = async () => {
   const cacheKeepList = [CACHE_NAME];
   const keyList = await caches.keys()
   const cachesToDelete = keyList.filter(key => !cacheKeepList.includes(key))
   await Promise.all(cachesToDelete.map(deleteCache));
}

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});
