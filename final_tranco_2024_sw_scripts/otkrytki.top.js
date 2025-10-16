self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('otkrytki-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/wp-content/themes/otkrytki/style.css', // Основной файл стилей
        '/wp-content/themes/otkrytki/js/app.js',    // Основной файл скриптов
        '/favicon/touch-icon-ipad.png',
        '/favicon/favicon-192x192.png'
      ]);
    })
  );
});

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
*/
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});