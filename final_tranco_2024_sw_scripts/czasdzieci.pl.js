importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.routing.registerRoute(
    new RegExp('/css/'),
    new workbox.strategies.CacheFirst({
        cacheName: 'css',
        plugins: [
            new workbox.expiration.Plugin({
              maxAgeSeconds: 30 * 24 * 60 * 60,
              maxEntries: 20,
            }),
        ]
    })
);

workbox.routing.registerRoute(
    new RegExp('/(js|_j)/'),
    new workbox.strategies.CacheFirst({
        cacheName: 'js',
        plugins: [
            new workbox.expiration.Plugin({
              maxAgeSeconds: 30 * 24 * 60 * 60,
              maxEntries: 20,
            }),
        ]
    })
);
