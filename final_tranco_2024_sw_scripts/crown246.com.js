//const cacheName = 'images_cache';

// self.addEventListener('install', (event) => {
//   console.log(event);
//   //event.waitUntil(caches.open(cacheName));
// });

// self.addEventListener('fetch', async (event) => {
//   if (event.request.destination === 'image') {
//     event.respondWith(
//       caches.open(cacheName).then((cache) => {
//         return cache.match(event.request).then((cachedResponse) => {
//           return (
//             cachedResponse ||
//             fetch(event.request.url).then((fetchedResponse) => {
//               cache.put(event.request, fetchedResponse.clone());

//               return fetchedResponse;
//             })
//           );
//         });
//       })
//     );images_cache
//   } else {
//     return;
//   }
// });

let STATIC_CACHE_NAME = 'gfg-pwa';
let DYNAMIC_CACHE_NAME = 'dynamic-gfg-pwa';

// Add Routes and pages using React Browser Router
let urlsToCache = ['/'];

// Install a service worker
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return requests
// self.addEventListener('fetch', (event) => {
//   if (!(event.request.url.indexOf('http') === 0)) return;
//   event.respondWith(
//     caches.match(event.request).then((cacheRes) => {
//       // If the file is not present in STATIC_CACHE,
//       // it will be searched in DYNAMIC_CACHE
//       return (
//         cacheRes ||
//         fetch(event.request).then((fetchRes) => {
//           return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
//             cache.put(event.request.url, fetchRes.clone());
//             return fetchRes;
//           });
//         })
//       );
//     })
//   );
// });

// Update a service worker
self.addEventListener('activate', (event) => {
  let cacheWhitelist = ['gfg-pwa'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
