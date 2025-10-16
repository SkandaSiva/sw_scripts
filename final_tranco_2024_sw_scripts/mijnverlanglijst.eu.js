importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

// Debug
workbox.setConfig({
    debug: location.href.indexOf('.test') > -1
});

// Config
workbox.core.setCacheNameDetails({
    prefix: 'mw',
    suffix: 'v1'
});

// Precache offline page
workbox.precaching.precacheAndRoute([
    {url: '/offline', revision: '20210422'},
    {url: '/homescreen', revision: '20230712'}
]);

// Network first for wishlists (and redirects from / and /home)
workbox.routing.registerRoute(
    new RegExp('\\.\\w+/(|home|(friends|vrienden|freunde)|(w|v)/.+)(\\?.*)?(#.*)?$'),
    new workbox.strategies.NetworkFirst({
        cacheName: 'mw-pages',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 20,
            })
        ],
        matchOptions: {
                ignoreSearch: true
        }
    })
);

// Cache first for static assets
workbox.routing.registerRoute(
    new RegExp([
        '^https?://.+\\.js(\\?.+)?$', // all js
        '^https?://.+\\.css(\\?.+)?$', // all css
        '^https://fonts\\.(googleapis|gstatic)\\.com/', // google fonts
        '^https?://.+\\.(eot|svg|ttf|woff|woff2)(\\?.+)?$', // all fonts
        '\.(jpg|jpeg|png|gif|ico|svg)(\\?.+)?$' // local images
    ].join('|'), 'i'),
    new workbox.strategies.CacheFirst({
        cacheName: 'mw-assets',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 30 * 24 * 60 * 60,
                maxEntries: 50,
                purgeOnQuotaError: true,
                matchOptions: {
                    ignoreVary: true,
                },
            })
        ]
    })
);

// Offline fallback
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkOnly());
workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === "" || event.request.destination === 'document') {
        return workbox.precaching.matchPrecache('/offline');
    }
    return Response.error();
});