var CACHE = 'cache-v1.0.2';
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            cache.addAll([
                '/no-connection.html',
                '/term-condition',
                '/about-us',
                '/404',
                '/site-map',
                'https://static.gurugamer.com/images/404.jpg',
            ]);
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (CACHE !== key) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') {
        /*fetch(event.request).then(function (response) {
            /!* var responseToCache = response.clone();
            caches.open(CACHE).then(function(cache) {
              cache.put(event.request, responseToCache);
            }); *!/
            return response;
        });
        return true;*/
        return false;
    }
    if (event.request.url.indexOf('static.gurugamer.com') !== -1) {
        event.respondWith(
            caches.match(event.request).then(function (cacheResponse) {
                return cacheResponse
                    ? cacheResponse
                    : fetch(event.request).then(function (response) {
                        var responseToCache = response.clone();
                        caches.open(CACHE).then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    });
            })
        );
    } else {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (
                        response &&
                        response.type === 'basic' &&
                        response.status === 200
                    ) {
                        var responseToCache = response.clone();
                        caches.open(CACHE).then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(err => {
                    return caches.match(event.request).then(function (response) {
                        if (response) {
                            return response;
                        } else {
                            if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
                                return caches.match('/no-connection.html');
                            }
                            return null;
                        }
                    });
                })
        );
    }
});