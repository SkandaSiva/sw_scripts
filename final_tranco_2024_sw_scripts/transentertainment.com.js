self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('cache-pwa').then(function(cache) {
     return cache.addAll([
       // 'icon/fox-icon.png',
       // 'images/fox1.jpg',
       // 'images/mrt.jpg'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  //console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          console.log(cacheName);
        }).map(function(cacheName) {
          console.log(cacheName);
        })
      );
    })
  );
});
