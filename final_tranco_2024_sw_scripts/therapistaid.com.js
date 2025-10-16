const cacheName = 'v.1.0.4';

const cacheable = ['script', 'style', 'font'];

self.addEventListener('fetch', (event) => {
    if (!cacheable.includes(event.request.destination) || event.request.url.indexOf('http') !== 0) {
        return;
    }

    event.respondWith(caches.open(cacheName).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
            const fetchedResponse = fetch(event.request).then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
        
                return networkResponse;
            });
    
            return cachedResponse || fetchedResponse;
        });
    }));
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();

            return keys.map(async (cache) => {
                if(cache !== cacheName) {
                    return await caches.delete(cache);
                }
            });
        })()
    );
});