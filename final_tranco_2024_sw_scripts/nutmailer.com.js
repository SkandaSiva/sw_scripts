importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

var cacheVersionName = {
    images: 'images-v3',
    scripts: 'scripts-v17',
    styles: 'styles-v7',
};

var currentCacheNames = Object.values(cacheVersionName);

self.addEventListener('activate', function (event) {
    console.log('[sw] Activated');
    // event.waitUntil(
    //     caches.keys().then(function (cacheNames) {
    //         if (cacheNames.lenght === 0) return;
    //         return Promise.all(
    //             cacheNames.filter(function (cacheName) {
    //                 // elimina la cache si los nombres no coinciden (cache vieja)
    //                 if (currentCacheNames && !currentCacheNames.includes(cacheName)) {
    //                     return caches.delete(cacheName);
    //                 } else {
    //                     return false;
    //                 }
    //             })
    //         );
    //     })
    // );
});

self.addEventListener('push', function (event) {
    console.log('[sw] Pushed');

    if (event.data) {
        try {
            data = JSON.parse(event.data.text());
        } catch (error) {
            console.error('[sw] Error parsing data');
            return;
        }
    } else {
        return;
    }

    if (!data.title) {
        console.error('[sw] Missing title in push');
        return;
    }

    console.log('Segind push notification', data);

    event.waitUntil(
        self.registration.showNotification(data.title, data.options)
    );
});

workbox.setConfig({
    debug: false,
    skipWaiting: true,
});

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    /images\/(.*)\.(?:png|gif|jpg|jpeg|svg|webp)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: cacheVersionName.images,
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 61,
                maxAgeSeconds: 10 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /\.js/g,
    workbox.strategies.staleWhileRevalidate({
        cacheName: cacheVersionName.scripts,
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 80,
                maxAgeSeconds: 86400,
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /\.css$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: cacheVersionName.styles,
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 80,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'googleapis',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /\.woff2$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'fonts',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 80,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);