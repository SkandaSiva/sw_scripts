// This is a simple service worker that caches the resources needed for the PWA
// to work offline.

const CACHE_NAME = 'estitor-pwa-cache-v1';
const urlsToCache = [];

self.addEventListener('install', (event) =>
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
);

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
// Cache hit - return response
// if (response) {
//   return response;
// }
// return fetch(event.request);
//     })
//   );
// });
