var staticCacheName = 'djangopwa-v1';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '',
            ]);
        })
    );
});

// self.addEventListener('fetch', function (event) {
//
//     var requestUrl = new URL(event.request.url);
//     if (requestUrl.pathname === '/gtm.js' && requestUrl.search === '?id=GTM-P9VPZ86') {
//         console.log(requestUrl.pathname, requestUrl.search)
//
//         // Don't cache the GTM script
//         // event.respondWith(fetch(event.request));
//         return;
//     }
//     if (requestUrl.origin === location.origin) {
//         if ((requestUrl.pathname === '/')) {
//             event.respondWith(caches.match(''));
//             return;
//         }
//     }
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             return response || fetch(event.request);
//         })
//     );
// });