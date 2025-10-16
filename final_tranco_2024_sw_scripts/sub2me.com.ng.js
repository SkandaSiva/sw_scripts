let CACHE_SITE = 'sub2me-pwa-v.1.2.3.DEV';
let CACHE_DASHBOARD = 'sub2me-dashboard-v.1.2.3.DEV';
let urlsToCache = [
'/offline.html',
'/css/pwa.css',
'/js/pwa.js',
'/manifest.json',
'/img/pwa/pwa.svg',
'/img/pwa/192.png',
'/img/pwa/512.png',
'/img/pwa/maskable_icon.png'
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_SITE)
        .then(function(cache) {
            return cache.addAll(urlsToCache, {cache: 'reload'});
        })
        );
});
self.addEventListener('activate', event => {
    let cacheKeeplist = [CACHE_SITE, CACHE_DASHBOARD];
    self.clients.claim();
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('SW: Updated.');
                    return caches.delete(key);
                }
            }));
        })

        );
});
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' && event.request.method != 'POST' && !event.request.url.includes(':2083')) {
    event.respondWith(
        (async () => {
            try {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                const cacheResponse = await caches.match(event.request);
                if (cacheResponse) {
                    return cacheResponse;
                }
                const fallbackResponse = await caches.match('/offline.html');
                if (fallbackResponse) {
                    return fallbackResponse;
                }
            }
        })()
        );
}
});