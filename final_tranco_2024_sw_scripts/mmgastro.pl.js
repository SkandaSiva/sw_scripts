var filesToCache = [
    '/data/include/pwa/pwa-out-of-internet.gif',
    '/data/include/pwa/pwa-offline-pl.html',
    '/data/include/pwa/pwa-offline-en.html'
];

var cacheName = 'iai-pwa-out-of-internet-3';

self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil (
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method != 'GET') {
        return;
    }

    // adres strony
    var host = 'https://' + self.location.host;
    var eventUrl = event.request.url;
    if (event.request.url.startsWith(host) === false) {
        // event, który jest fetchowany przez PWA nie należy do adresu strony sklepu, odrzucamy
        return;
    }

    try {
        var regexStr = '(' + event.currentTarget.origin + '\/(ajax|api|customer-api|edi|fulfillment-api|marketplace-api|panel|rma|data\/)\/)';
    } catch (err) {
        return;
    }

    if (event.request.url.match(regexStr) !== null) {
        return;
    }

    try {
        var regexStr = event.currentTarget.origin + '\/(\\w{2,3}\/)?order';
    } catch (err) {
        return;
    }

    if (event.request.url.match(regexStr) !== null) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return fetch(event.request);
        }).catch(function(error) {
            if (!navigator.onLine) {
                return caches.match('/pwa_offline.html');
            }
            return;
        })
    );
});