const doCache = true;
const CACHE_NAME = 'engadin-online';

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(keyList =>
                Promise.all(keyList.map(key => {
                    if (!cacheWhitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })),
            ),
    );
});

self.addEventListener('install', function (event) {
    const urlsToCache = [
        '/en/', '/de/',
    ];

    if (doCache) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    if (self.manifestUri && typeof self.manifestUri !== 'undefined')
                        fetch(self.manifestUri, { 'credentials': 'same-origin' })
                            .then(response => {
                                response.json()
                            })
                            .then(() => {
                                cache.addAll(urlsToCache).catch(reason => {
                                    console.log(reason);
                                })
                            })
                }),
        );
    }
});

self.addEventListener('fetch', function (event) {
    const urlsPartsToIgnore = [
        'empfehlio.com',
        'guuru.com',
    ];

    let allowToCache = 1;
    urlsPartsToIgnore.forEach(text => {
        if (event.request.url.indexOf(text) !== -1) {
            allowToCache--
        }
    })

    if (doCache && allowToCache === 1) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            }),
        );
    }
});
