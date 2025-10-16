// sw.js

// install event
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open('deneo')
//       .then((cache) => {
//         return cache.addAll([
//           '../',
//           'index.html',
//           'app.css',
//           'app.js',
//           'manifest.webmanifest'
//         ]);
//       })
//       .then(() => {
//         return self.skipWaiting();
//       })
//   );
// });

// // fetch event
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });