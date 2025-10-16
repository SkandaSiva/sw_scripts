const filesToCache = [
  '/',
  '/global2/css/site.css',
  '/global2/css/home-min.css',
  '/index-offline.php',
  '/media/dynamic/images/sm-647-downtown-tacoma-wa.jpg',
  '/404.php'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});