var CACHE_NAME = '360CRMPRO-cache-v2';

var urlsToCache = [
    'manifest.json',
    
];

self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
            .catch(function (err) {
                console.log(err);
            })

    );
});

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//             .then(function (response) {
//                 // Cache hit - return response
//                 if (response) {
//                     return response;
//                 }
//                 return fetch(event.request);
//             })
//             .catch(function (err) {
//                 console.log(err);
//             })

//     );
// });

// remove old cache if any
self.addEventListener('activate', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(async (cacheName) => {
            console.log(cacheName);
            if (CACHE_NAME !== cacheName) {
                await caches.delete(cacheName);
            }
        }))
            .then(doIfNoError)
            .catch(console.log)
    })());
});

doIfNoError = () => console.log('No errors');