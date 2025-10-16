const cacheName = 'v106';

self.addEventListener('install', event => {
});

self.addEventListener('activate', event => {

    caches.keys()
        .then(cacheNames => {
            cacheNames
                .filter(name => name !== cacheName)
                .forEach(name => caches.delete(name).then(res => res))
        });
});

self.addEventListener('fetch', event => {
    const patterns = [
        /static\/js\//,
        /static\/css\//,
        /static\/fonts\//,
        /static\/images\//,
    ];
    const url = event.request.url;

    if (patterns.find(pattern => url.match(pattern))) {
        event.respondWith(
            caches.open(cacheName)
                .then(cache => cache.match(event.request.url)
                    .then(cached => {
                        if (cached) {
                            return cached;
                        }

                        return fetch(event.request).then(response => {
                            let responseClone = response.clone();
                            caches.open(cacheName)
                                .then(cache => cache.put(event.request, responseClone));

                            return response;
                        });
                    })
                )
        );
    }
    else {
        return;
    }
});