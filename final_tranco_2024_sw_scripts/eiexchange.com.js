//https://developers.google.com/web/fundamentals/primers/service-workers
const CACHE_NAME = 'eix-cache-v0';
const urlsToCache = [];

self.addEventListener('install', () => { skipWaiting() });
self.addEventListener('activate', () => {
    caches.has(CACHE_NAME).then(has => {
        if (has) {
            caches.keys().then(keys => {
                keys.forEach(key => { caches.delete(key) })
            })
        }
    })
});
self.addEventListener('fetch', () => { });
