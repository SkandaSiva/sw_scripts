importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
self.skipWaiting(); 
if (workbox) {
    console.log(`Yay! Workbox is loaded...`);
    workbox.routing.registerRoute(
        // Cache image files.
        /\.(?:png|jpg|jpeg|svg|gif)$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: 'new-image-cache',
            plugins: [
                new workbox.strategies.CacheFirst({
                    plugins: [
                        new workbox.cacheableResponse.Plugin({
                            statuses: [0, 200]
                        })
                    ]
                }),
                new workbox.expiration.Plugin({
                    // Cache only 200000 images.
                    maxEntries: 200000,
                    // Cache for a maximum of 10 years.
                    maxAgeSeconds: 3650 * 24 * 60 * 60,
                    purgeOnQuotaError: true
                })
            ],
        })
    );

    workbox.routing.registerRoute(
        // Cache js files.
        /\.(?:js|css)$/,
        // Use the cache if it's available.
        new workbox.strategies.NetworkFirst({
            // Use a custom cache name.
            cacheName: 'js-css-cache',
            plugins: [
                new workbox.strategies.NetworkFirst({
                    plugins: [
                        new workbox.cacheableResponse.Plugin({
                            statuses: [0, 200]
                        })
                    ]
                }),
                new workbox.expiration.Plugin({
                    // Cache only 200000 js.
                    maxEntries: 200000,
                    // Cache for a maximum of 1 day.
                    maxAgeSeconds: 24 * 60 * 60,
                    purgeOnQuotaError: true
                })
            ],
        })
    );
}