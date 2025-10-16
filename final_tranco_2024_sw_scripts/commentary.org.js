const cacheName = 'v1.0.0';

const cacheAssets = [

];

self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});


self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing Old Cache');

                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});


self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');

    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            if(cachedResponse){
                console.log('Found in cache!');

                return cachedResponse;
            }

            return fetch(e.request);
        })
    );
});