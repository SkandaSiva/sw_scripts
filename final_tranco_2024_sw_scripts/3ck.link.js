const cacheVersion = 1;
const currentCache = {
    offline: 'offline-cache' + cacheVersion
};
const offlineUrl = '/offline/offline.html';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(currentCache.offline).then(cache => {
            return cache.addAll([
                '/offline/offline.html',
                '/offline/bootstrap.css',
                '/offline/Cairo-Regular.ttf',
                '/offline/offline.gif'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    if (navigator.onLine === false) {
        const requestURL = new URL(event.request.url);
        if (requestURL.origin === location.origin) {
            if (/\.(css|js|woff|woff2|ttf|eot|svg|gif)$/.test(requestURL.pathname)) {
                event.respondWith(
                    caches.open(currentCache.offline).then(cache =>
                        caches.match(event.request).then((result) => {
                            return result;
                        }),
                    ),
                );
                return;
            }
        }
        if (event.request.mode === 'navigate') {
            return event.respondWith(
                fetch(event.request).catch(() => caches.match(offlineUrl))
            );
        }
    }
});