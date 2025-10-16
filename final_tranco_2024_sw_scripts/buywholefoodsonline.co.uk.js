const CACHE_NAME = 'v123';
const logo = '/assets/logo.png';
const excludeUrl = 'cloudfront.net';
const excludeAssets = 'cloudfront.net/com/assets';
const urlsToCache = [
    '/index.html',
    logo,
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});
/*
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            return resp || fetch(event.request).then((response) => {
                let responseClone = response.clone();

                if (
                    event.request.method === 'GET'
                    && event.request.url.indexOf('http') === 0
                    && event.request.url.includes(excludeUrl)
                    && !event.request.url.includes(excludeAssets)
                ) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            });
        }).catch(() => {
            return caches.match(logo);
        })
    );
});
*/
self.addEventListener('activate', (event) => {
    const cacheKeysList = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeysList.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
