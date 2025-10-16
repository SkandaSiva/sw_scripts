// Service Worker

/* Google Workbox CDN */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
workbox.setConfig({
    debug: true
});
const {registerRoute} = workbox.routing;
const {CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;

//precaching
workbox.precaching.cleanupOutdatedCaches();
/*workbox.precaching.precacheAndRoute([
    '/@@css-placeholder',
    '/@@js-placeholder',
]);*/

// normal caching...
workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'js-css-cache-1',
    }),
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'images-cache-1',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
);

/* End Google Workbox CDN */
