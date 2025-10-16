self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('summle').then((cache) => cache.addAll([
      '/',
      '/manifest.json',
      '/css/normalize.css',
      '/css/barebones.css',
      '/css/screen.css',
      '/js/jquery.js',
      '/js/extras.js',
      '/js/main.min.js',
      '/apple-touch-icon.png',
      '/images/example1.png',
      '/images/example1.gif',
      '/images/favicon-16x16.png',
      '/images/favicon-32x32.png'
    ])),
  );
});

self.addEventListener('fetch', function(event) {
   
   if (event.request.method == 'POST') {
      return;
   }
   
  event.respondWith(
    caches.open('summle').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response || cache.match(event.request);
      }).catch(function(error) {
         return cache.match(event.request);
      });
    })
  );
});