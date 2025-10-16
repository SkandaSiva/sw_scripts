self.addEventListener('fetch', (fetchEvent) => {
    console.log('Service Worker: Fetch event');
    console.table({
        URL: fetchEvent.request.url,
        Referrer: fetchEvent.request.referrer,
        Method: fetchEvent.request.method
    });

    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Service Worker: Serving from cache:', fetchEvent.request.url);
                return cachedResponse;
            }
            console.log('Service Worker: Fetching from network:', fetchEvent.request.url);
            return fetch(fetchEvent.request).catch((error) => {
                console.error('Service Worker: Network request failed:', error);
                throw error;
            });
        })
    );
});
self.addEventListener('install', (installEvent) => {
    console.log('Service Worker: Install event');
    installEvent.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (activateEvent) => {
    console.log('Service Worker: Activate event');
    activateEvent.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (fetchEvent) => {
    console.log('Service Worker: Fetch event');
    console.log('Request URL:', fetchEvent.request.url);

    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('Service Worker: Serving from cache:', fetchEvent.request.url);
                return cachedResponse;
            }
            console.log('Service Worker: Fetching from network:', fetchEvent.request.url);
            return fetch(fetchEvent.request).catch((error) => {
                console.error('Service Worker: Network request failed:', error);
                throw error;
            });
        })
    );
});
