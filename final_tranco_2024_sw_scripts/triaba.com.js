const dynamicCacheName = 'triaba-dynamic-cache-v1';

// install event
self.addEventListener('install', () => null);

// activate event
self.addEventListener('activate', evt => {

    // Deleting old versions of cache
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );

    return self.clients.claim();
});

// fetch events
self.addEventListener('fetch', evt => {
    // Matching requests to only cache images from Strapi
    if (!evt?.request?.url?.match(/(.*?)\/uploads\/(.*?)/)) return;

    evt.respondWith(
        // Try to match the request with something on cache
        caches.match(evt.request).then(cacheRes => {

            // If not available on cache then we bring it from the fetch itself
            // and then save it on cache before returning
            return cacheRes || fetch(evt.request).then(fetchRes => {

                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    // check cached items size
                    return fetchRes;
                });
            });
        })
    );
});