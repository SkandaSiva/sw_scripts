// Добавить в кеш конкретные файлы при установке PWA
/*self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('fox-store').then(function(cache) {
     return cache.addAll([
       '/index.php',
       '/index.js',
       '/style.css',
       '/image.jpg'
     ]);
   })
 );
});*/

// Добавляем в кеш все js файлы
self.addEventListener('fetch', function(e) {
    //console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});

