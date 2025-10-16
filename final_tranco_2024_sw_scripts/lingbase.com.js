this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/templates/lin/no-connection.html'
      ]);
    })
  );
});

this.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match('/templates/lin/no-connection.html');
    })
  );
});



