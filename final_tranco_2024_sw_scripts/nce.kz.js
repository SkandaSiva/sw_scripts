let CACHE_NAME = 'my-site-cache-v1';
let urlsToCache = [
];

self.addEventListener('install', function (event) {

    // установка
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                caches.delete(CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function () {
                caches.delete(CACHE_NAME);
            })
    );
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // ресурс есть в кеше
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
