const version = 11;
const cacheName = `urban-cache-v${version}`;

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(['/offline']);
    })
  );
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in cacheName
  // which will get rid of previous cacheName
  event.waitUntil(
    caches.keys().then(prevCaches =>
      Promise.all(
        prevCaches.map(prevCache => {
          if (prevCache !== cacheName) {
            return caches.delete(prevCache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function(response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function() {
        // If both fail, show a generic fallback:
        console.log(`offline ${version}`);
        return caches.match('/offline');
        // However, in reality you'd have many different
        // fallbacks, depending on URL & headers.
        // Eg, a fallback silhouette image for avatars.
      })
  );
});
