self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll([
       '/img/logo.png',
       '/js/fns_2.js',
       '/css/main.css'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  //console.log(e.request.url);
  //console.log('kopche');
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});