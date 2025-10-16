importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');
// Cache page navigations (html) with a Network First strategy
// workbox.setConfig({
//     debug: true,
// });
workbox.loadModule('workbox-routing');
workbox.loadModule('workbox-strategies');
workbox.loadModule('workbox-cacheable-response');
workbox.loadModule('workbox-expiration');
workbox.loadModule('workbox-precaching');
//workbox.loadModule('workbox-recipes');



const {registerRoute,setCatchHandler} = workbox.routing;
const {NetworkFirst,StaleWhileRevalidate,CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;
const {precacheAndRoute,matchPrecache} = workbox.precaching;
//const {offlineFallback} = workbox.recipes;


// offlineFallback();

// precacheAndRoute([
//     {url: '/', revision: 1 }
// ]);

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
    // Return the precached offline page if a document is being requested
    if (event.request.destination === 'document') {
        return matchPrecache('/offline.html');
    }

    return Response.error();
});
self.addEventListener('install', e => {
    self.skipWaiting();
});

//Cache page navigations (html) with a Network First strategy
// registerRoute(
//     //({url}) => url.origin === 'https://www.indiaweather24.com/',
//     // Check to see if the request is a navigation to a new page
//     ({ request }) => request.mode === 'navigate',
//     // Use a Network First caching strategy
//     new NetworkFirst({
//         // Put all cached files in a cache named 'pages'
//         cacheName: 'pages',
//         plugins: [
//             // Ensure that only requests that result in a 200 status are cached
//             new CacheableResponsePlugin({
//                 statuses: [200],
//             }),
//         ],
//     }),
// );

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
    // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||

        request.destination === 'worker',
    // Use a Stale While Revalidate caching strategy
    new StaleWhileRevalidate({
        // Put all cached files in a cache named 'assets'
        cacheName: 'assets',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
);

// Cache images with a Cache First strategy
registerRoute(
    // Check to see if the request's destination is style for an image
    ({ request }) => request.destination === 'image' || request.destination === 'font',

    // Use a Cache First caching strategy
    new CacheFirst({
        // Put all cached files in a cache named 'images'
        cacheName: 'images',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new CacheableResponsePlugin({
                statuses: [200],
            }),
            // Don't cache more than 50 items, and expire them after 30 days
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            }),
        ],
    }),
);




