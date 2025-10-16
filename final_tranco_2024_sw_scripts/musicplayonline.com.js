importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const {registerRoute} = workbox.routing;
const {CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
// const {NetworkFirst} = workbox.strategies;
const {StaleWhileRevalidate} = workbox.strategies;
const {ExpirationPlugin} = workbox.expiration;


registerRoute(
    ({request}) => (request.destination === 'script' || request.destination === 'style'),
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 20 * 60, // 20 minutes
                purgeOnQuotaError: true,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'image-resources',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
                purgeOnQuotaError: true,
            }),
        ],
    })
);