importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {

    /**
     * Precaching-pages for K-Tipp
     */

    workbox.precaching.precacheAndRoute([
        '/service-worker.js',
        {url: '/pwa-keine-internetverbindung/', revision: '934934'},
    ]);

    workbox.routing.registerRoute(
        /\.js$/,
        new workbox.strategies.NetworkFirst()
    );

    workbox.routing.registerRoute(
        /./,
        new workbox.strategies.NetworkFirst()
    );


    workbox.routing.registerRoute(
        /\.js$/,
        new workbox.strategies.NetworkFirst()
    );

    workbox.routing.registerRoute(
        // Cache CSS files.
        /\.css$/,
        // Use cache but update in the background.
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name.
            cacheName: 'css-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache image files.
        /\.(?:png|jpg|jpeg|svg|gif)$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: 'image-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache only 20 images.
                    maxEntries: 20,
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                })
            ],
        })
    );

    workbox.routing.setCatchHandler(({event}) => {
        // The FALLBACK_URL entries must be added to the cache ahead of time, either via runtime
        // or precaching.
        // If they are precached, then call workbox.precaching.getCacheKeyForURL(FALLBACK_URL)
        // to get the correct cache key to pass in to caches.match().
        //
        // Use event, request, and url to figure out how to respond.
        // One approach would be to use request.destination, see
        // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
        switch (event.request.destination) {
            case 'document':
                return caches.match(workbox.precaching.getCacheKeyForURL('/pwa-keine-internetverbindung/'));
                break;

                /*
            case 'image':
                return caches.match(FALLBACK_IMAGE_URL);
                break;

            case 'font':
                return caches.match(FALLBACK_FONT_URL);
                break;
*/
            default:
                // If we don't have a fallback, just return an error response.
                return Response.error();
        }
    });

} else {
    alert('Es ist ein Fehler aufgetreten. Die Webseite kann nicht als App verwendet werden');
}
