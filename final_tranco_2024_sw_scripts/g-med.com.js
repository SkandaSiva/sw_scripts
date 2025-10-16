self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll([
       '/a2/index.html',
       '/a2/index.js',
       '/a2/style.css',
       '/a2/images/fox1.jpg',
       '/a2/images/fox2.jpg',
       '/a2/images/fox3.jpg',
       '/a2/images/fox4.jpg'
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