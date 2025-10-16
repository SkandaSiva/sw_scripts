importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

var expectedCaches = ['jscss-v1732673578124', 'statics-v1732673578124', 'media-v1732673578124'];

workbox.setConfig({
    debug: false
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// import { registerRoute } from 'workbox-routing';
// import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
// import { ExpirationPlugin } from 'workbox-expiration';

self.addEventListener('activate', event => {
    // delete any caches that aren't in expectedCaches
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!expectedCaches.includes(key)) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            // console.log( 'V2 now ready to handle fetches!' );
        })
    );

    // Enforce immediate scope control
    return self.clients.claim();
}); 


workbox.routing.registerRoute(
    // Cache static resources mainly JS and CSS files
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    // Use cache but update in the background.
    new workbox.strategies.StaleWhileRevalidate({
        // Use a custom cache name.
        cacheName: 'jscss-v1732673578124',
    })
);


workbox.routing.registerRoute(
    // Cache icons
    ({url}) => url.pathname.endsWith('.svg') || url.pathname.endsWith('.woff2'),
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'statics-v1732673578124',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                // Cache only 20 images.
                maxEntries: 20,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);

workbox.routing.registerRoute(
    // Cache videos
    ({url}) => url.pathname.endsWith('.mp4'),
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'media-v1732673578124',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                // Cache only 3 videos.
                maxEntries: 3,
                // Cache for a maximum of a week.
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);


