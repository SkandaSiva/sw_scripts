self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('vrespet-a2hs-cache').then(function(cache) {
     return cache.addAll([
       '/'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
//  console.log(e.request.url);
//  e.respondWith(
//    caches.match(e.request).then(function(response) {
//      return response || fetch(e.request);
//    })
//  );
});

self.addEventListener('activate', function(event) {
//    console.log('activate');
});