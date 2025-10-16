// const CACHE_NAME = "behtarino-v-1.0.1";
//
// var urlsToCache = [];

// self.addEventListener("install", (event) => {
//     // Perform install steps
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//     );
// });

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request).then(() =>
//             // Cache hit - return response
//             fetch(event.request)
//         )
//     );
// });

// self.addEventListener("activate", (event) => {
//     // Remove old caches
//     event.waitUntil(
//         (async () => {
//             const keys = await caches.keys();
//             return keys.map(async (cache) => {
//                 if (cache !== CACHE_NAME) {
//                     return await caches.delete(cache);
//                 }
//             });
//         })()
//     );
// });
