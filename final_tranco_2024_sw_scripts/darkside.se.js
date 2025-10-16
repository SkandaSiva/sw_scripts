// Service worker

console.log('Hello world, I am service worker.');


// provide offline access
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sw-cache').then(function(cache) {
      return cache.add('/');
    })
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      //return response || fetch(event.request);
      return fetch(event.request); // Vi bypassar cachen just nu!
    })
  );
});

