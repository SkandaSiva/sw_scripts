importScripts('https://ssl.widgets.webengage.com/js/service-worker.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

//Configuration for google analytics
/*workbox.googleAnalytics.initialize({
    parameterOverrides: {
        cd13: 'offline',
    },
    hitFilter: (params) => {
        const queueTimeInSeconds = Math.round(params.get('qt') / 1000);
        params.set('cm3', queueTimeInSeconds);
    },
});*/

var pageHandler = workbox.strategies.networkFirst({
    cacheName: 'pages',
    plugins: [
        new workbox.expiration.Plugin({
            // Cache only 50 pages
            maxEntries: 50,
            // Cache for a maximum of 1 day
            maxAgeSeconds: 1 * 24 * 60 * 60,
        })
    ]
});

workbox.routing.registerRoute('/', pageHandler);
workbox.routing.registerRoute('/mind/', pageHandler);
workbox.routing.registerRoute('/intimate-health/', pageHandler);
workbox.routing.registerRoute('/preventive-care/', pageHandler);
workbox.routing.registerRoute('/healthy-eating/', pageHandler);
workbox.routing.registerRoute('/fitness/', pageHandler);
workbox.routing.registerRoute('/beauty/', pageHandler);
workbox.routing.registerRoute('/health-news/', pageHandler);
workbox.routing.registerRoute('/she-slays/', pageHandler);
workbox.routing.registerRoute('/mom-says/', pageHandler);
workbox.routing.registerRoute('/podcasts/', pageHandler);
workbox.routing.registerRoute('/video/', pageHandler);
workbox.routing.registerRoute('/photos/', pageHandler);
workbox.routing.registerRoute('/quiz/', pageHandler);

workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    //new RegExp('^https://www.hindustantimes.com/'),
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
        // Use a custom cache name
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 200 images
                maxEntries: 200,
                // Cache for a maximum of a week
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            })
        ],
    })
);