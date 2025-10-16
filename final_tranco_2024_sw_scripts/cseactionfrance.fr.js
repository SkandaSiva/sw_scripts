const cacheName = 'a2hs-test';
const resourcesToCache = [
  'modules/android/189/app.php',
  'manifest5.php',
  'modules/android/189/icons/icon-512.png',
  'modules/android/189/icons/icon-256.png',
  'modules/android/189/icons/icon-96.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(resourcesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
