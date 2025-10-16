importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

console.log('ServiceWork carregado!');

/**
 * Estratérias de Cache PWA
 */
if ( ! workbox) {
    console.log(`Putz! O Workbox não está carregado 😬`);
} else {
    console.log(`Massa! Tudo certo, Workbox pronto pra festa 🎉`);

    workbox.setConfig({ debug: true });
    workbox.core.setCacheNameDetails({
        prefix: 'mundogeo-app',
        suffix: 'v1.1'
    });
    workbox.googleAnalytics.initialize();

    workbox.routing.registerRoute(
        /.*googleapis\.com/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'googleapis',
        })
    );

    workbox.routing.registerRoute(
        /.*gstatic\.com/,
        new workbox.strategies.CacheFirst({
            cacheName: 'gstatic',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        /\/resources\/images\/.*$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'mundogeo-resources-images',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 60 * 60 * 24 * 60, // 60 Days
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        /\/wp-content\/plugins\/(.*)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'mundogeo-plugins-assets',
        })
    );

    workbox.routing.registerRoute(
        /\/wp-includes\/(.*)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'mundogeo-includes-assets',
        })
    );

    workbox.routing.registerRoute(
        /\/wp-content\/themes\/mundogeo\/(.*)\.(?:js|css|map)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'mundogeo-assets',
        })
    );

    workbox.routing.registerRoute(
        /\/wp-content\/uploads\/(.*)\.(?:png|gif|jpg|jpeg|webp|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'mundogeo-uploads',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 14 * 24 * 60 * 60, // 14 Days
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        '/manifest.json',
        new workbox.strategies.NetworkFirst({
            cacheName: 'manifest-json',
        })
    );

    // workbox.routing.registerRoute(
    //     /.*\.(?:js|css)$/,
    //     new workbox.strategies.StaleWhileRevalidate({
    //         cacheName: 'static-assets',
    //     })
    // );

    workbox.routing.registerRoute(
        '/?utm_source=pwa',
        new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
        '/',
        new workbox.strategies.NetworkFirst()
    );

}
