


const OFFLINE_VERSION = 50;
if (console && console.log) {
    console.log('service-worker version ' + OFFLINE_VERSION);
}
const CACHE_NAME = 'offline';
const OFFLINE_URL = '/offline?sw=' + OFFLINE_VERSION;
const Image_404 = '/img/layout/layout.svg?sw=' + OFFLINE_VERSION;
const contentToCache = [
      OFFLINE_URL
    , Image_404
    , '/logo.svg' 
    , '/favicon-192x192.png' 
    , '/favicon-512x512.png' 
    , '/favicon.ico?sw=' + OFFLINE_VERSION
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());
    self.clients.claim();
});

function isImage(fetchRequest) {
    return fetchRequest.method === "GET"
        && fetchRequest.destination === "image";
}

self.addEventListener('fetch', (event) => {

    if (event.request.url.indexOf('upl-doc') !== -1) { return; }
    if (event.request.url.indexOf('act-upl') !== -1) { return; }
    
    event.respondWith((async () => {
        try {

            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
                return preloadResponse;
            }

            const networkResponse = await fetch(event.request);
            return networkResponse;
        } catch (error) {

            if (console && console.log) {
                console.log('Fetch failed!', error);
            }

            const cache = await caches.open(CACHE_NAME);
            if (event.request.mode === 'navigate') {
                if (console && console.log) {
                    console.log('returning offline page instead.', error);
                }
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            } else {
                //const cachedResponse = await cache.match(Image_404);
                //return cachedResponse;
                return cache.match(event.request)
                    .then(function (response) {
                        if (response) {
                            //console.log('SERVED FROM CACHE', event.request);
                            return response;
                        }
                        if (isImage(event.request)) {
                            return cache.match(Image_404);
                        }
                    });
            }

        }
    })());

});