importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const version = 'v1.23';

workbox.setConfig({
    debug: false
});

workbox.core.setCacheNameDetails({
    prefix: 'supersales',
});

workbox.precaching.precacheAndRoute([
    { url: '/offline', revision: version } ,
    'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
    'https://fonts.googleapis.com/css?family=Roboto:400,400i,700',
]);

workbox.routing.registerRoute(
    new RegExp('/assets/'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-assets',
    })
);


// Navigate strategy (for page requests), configure a separate cache to prevent pages being cleaned up
// Try to fetch from network, fallback to cache if not available
// var navigateStrategy = workbox.strategies.networkFirst({
//     cacheName: "page-cache",
//     plugins: [
//         new workbox.expiration.Plugin({
//             maxEntries: 250,
//             maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
//             purgeOnQuotaError: true, // Opt-in to automatic cleanup
//         }),
//         new workbox.cacheableResponse.Plugin({
//             statuses: [0, 200] // for opague requests
//         }),
//     ],
// });


workbox.routing.setDefaultHandler(
    async (args) => {
        if (args.event.request.method === 'GET') {
            // use service worker strategies only for GET requests (POST is not cacheable)
            new workbox.strategies.NetworkOnly();
        }
        return fetch(args.event.request);
    }
);

// This "catch" handler is triggered when any of the other routes fail to generate a response.
workbox.routing.setCatchHandler(({event}) => {
    // The FALLBACK_URL entries must be added to the cache ahead of time, either via runtime
    // or precaching.
    // If they are precached, then call workbox.precaching.getCacheKeyForURL(FALLBACK_URL)
    // to get the correct cache key to pass in to caches.match().
    //
    // We return an 'offline' page for navigational requests, ajax requests will have to be dealt with in our frontend code.
    if(event.request.mode === 'navigate') {
        return caches.match(workbox.precaching.getCacheKeyForURL('/offline'));
    } else {
        return Response.error();
    }

});
