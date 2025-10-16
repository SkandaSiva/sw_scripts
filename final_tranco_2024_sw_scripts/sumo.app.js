// Choose a cache name
const cacheID = 'suite-1';
// List the files to precache
const precacheResources = ['/'];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  // console.log('Service worker install event!');
  //event.waitUntil(
  //  caches.open(cacheID)
  //    .then((cache) => cache.addAll(precacheResources))
  //    .then(self.skipWaiting())
  //  );
});

self.addEventListener('activate', (event) => {
  // console.log('Service worker activate event!');
  //event.waitUntil(
  //  caches.keys().then(cacheNames => {
  //    return Promise.all(
  //      cacheNames.map(cacheName => {
  //        if (cacheName !== cacheID) {
  //          return caches.delete(cacheName);
  //        }
  //      })
  //    );
  //  })
  //)
});

// https://jakearchibald.com/2014/offline-cookbook/
// Network falling back to cache
self.addEventListener('fetch', (event) => {
  //event.respondWith(async function() {
  //  try {
  //    return await fetch(event.request);
  //  } catch (err) {
  //    return caches.match(event.request);
  //  }
  //}());
});
