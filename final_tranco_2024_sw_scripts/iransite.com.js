

self.addEventListener('install', (event) => {
    // console.log('[Service Worker] Installing Service worker ...', e);
    event.waitUntil(
        caches.open('static')
        .then((cache)=>{
            console.log('[Service Worker] Prechaching App Sell');
            cache.addAll([
                '/',
            ])
        })
        );
});
self.addEventListener('activate', (event) => {
    // console.log('[Service Worker] Activated Service worker ...', e);
    return self.clients.claim();
});

// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.match(event.request)
//         .then((response)=>{
//             if(response) {
//                 return response;
//             }
//             else{
//                 return fetch(event.request);
//             }
//         })
//         .catch()
//     );
// })

