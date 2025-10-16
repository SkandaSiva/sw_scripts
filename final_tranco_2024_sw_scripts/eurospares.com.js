var CACHE_NAME = 'eurospares-cache-v2';
var urlsToCache = [
    '/css/site.min.css',
    '/css/fontawesome.min.css',
    '/css/regular.min.css',
    '/css/eurospares.min.css',
    '/js/site.min.js',
    '/js/backoffice.min.js',
    '/js/signalr.min.js',
    '/js/signalr-protocol-msgpack.min.js'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method === 'POST') {
        event.respondWith(
            (async () => {
                try {
                    const response = await fetch(event.request.clone());
                    return response;
                } catch (error) {
                    return new Response('Error handling POST request', { status: 400 });
                }
            })()
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});

self.addEventListener('activate', function (event) {
    var cacheAllowlist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
