var cacheName = 'poocoo_V201802061321';

var filesToCache = [
    //"./",
    //"/images/logo.png",
    //"/images/search.png",
    //"/images/progress.gif",
    //"/css/site.min.css",
    //"/js/site.min.js",
];

self.addEventListener('install', function (e) {
    //console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            //console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    //console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    //console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
        return;
    }
    if (e.request.method === "POST") {
        return;
    }
    if (!e.request.url.startsWith(self.location.origin)) {
        return;
    }
    e.respondWith(
        caches.open(cacheName).then(function (cache) {
            return fetch(e.request).then(function (response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        })
    );
    //e.respondWith(
    //    caches.match(e.request).then(function (response) {
    //        return response || fetch(e.request);
    //    })
    //);
});