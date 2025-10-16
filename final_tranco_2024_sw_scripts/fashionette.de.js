self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('main')
    .then(cache => cache.addAll([
      '/flyout.html'
    ]))
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('main').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
