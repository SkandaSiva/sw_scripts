// service-worker.js

const CACHE_NAME = 'my-pwa-cache';
const urlsToCache = [
  '/',
  '/templates/magic/assets/css/themes/styles.css',
  '/templates/magic/assets/js/whmcs.js',
  '/templates/magic/assets/images/hero-bg1.jpg',
  // Προσθέστε όλα τα στοιχεία που θέλετε να αποθηκευτούν στην cache
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
