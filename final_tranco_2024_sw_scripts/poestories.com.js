self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('poe-cache03').then(function(cache) {
     return cache.addAll([
       '/images/poestories.png'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});