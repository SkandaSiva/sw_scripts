importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    // Precaching
    const OFFLINE_FALLBACK = '/offline.html';
    workbox.precaching.precacheAndRoute([{ url: OFFLINE_FALLBACK, revision: 'v8' }]);

    // Images
    workbox.routing.registerRoute(
        /https:\/\/chico-rei\.imgix\.net.*/,
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name
            cacheName: 'imgix-chico-rei-cache',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                    purgeOnQuotaError: true,
                }),
            ],
        })
    );

    // Js, CSS e Fonts
    workbox.routing.registerRoute(
        /https:\/\/(?:dmedtey819y2a|d3m65xlfrq0b3j|d37qth7w71a0im|fonts\.gstatic).*\.(?:js|css|gif|woff2|woff|eot|ttf)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'scripts-css-gifs-fonts',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    // Cache for a maximum of a week
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                    purgeOnQuotaError: true,
                }),
            ],
        })
    );

    // Offline Callback
    const siteHandler = new workbox.strategies.NetworkOnly({
        cacheName: 'offline-cache',
    });
    workbox.routing.registerRoute(
        /(?:http|https):\/\/chicorei\.(?:com|site)(?!\/admin|.*?\.php)/,
        function (event) {
            return siteHandler.handle(event).catch(function (err) {
                return caches.match(workbox.precaching.getCacheKeyForURL(OFFLINE_FALLBACK));
            });
        }
    );
}
