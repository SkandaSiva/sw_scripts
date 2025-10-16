const CACHE_NAME = 'offline';
const OFFLINE_URL = '/sewingstreet/offline.html';

self.addEventListener('install', function (event) {
    //console.log('[ServiceWorker] Install');

    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // Setting {cache: 'reload'} in the new request will ensure that the response
        // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
        await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })());

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    //console.log('[ServiceWorker] Activate');
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    var request = event.request,
        accept = request.headers.get('accept')

    if (
        request.mode !== 'navigate' ||
        request.method !== 'GET' ||
        (accept && !accept.includes('text/html'))
    ) {
        return;
    }

    // bypasses for: HTTP basic auth issues, file download issues (iOS), common ad blocker issues
    if (request.url.match(/\/admin\.php|\/install\/|\/download($|&|\?)|[\/?]attachments\/|google-ad|adsense/)) {
        if (supportPreloading && event.preloadResponse) {
            event.respondWith(event.preloadResponse);
        }

        return;
    }

    var response = Promise.resolve(event.preloadResponse)
        .then(function (r) {
            return r || fetch(request)
        });

    event.respondWith(
        response
            .catch(function (error) {
                return caches.open(CACHE_NAME)
                    .then(function (cache) {
                        return cache.match(OFFLINE_URL);
                    });
            })
    );
});
