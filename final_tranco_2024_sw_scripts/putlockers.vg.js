const CACHE_NAME = 'v1';
const CACHE_URLS = [];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            cache.addAll(CACHE_URLS);
        })
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', evt => {

});