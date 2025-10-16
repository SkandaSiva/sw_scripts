importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    const CACHE_PREFIX = 'FTV';

    workbox.setConfig({
        clientsClaim: true,
        //debug: true,
        skipWaiting: true
    });
    //workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);

    const { registerRoute } = workbox.routing;
    const { CacheFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
    const { CacheableResponsePlugin } = workbox.cacheableResponse;
    const { ExpirationPlugin } = workbox.expiration;

    const FALLBACK_HTML_URL = "/offline.html";
    workbox.precaching.precacheAndRoute([
        FALLBACK_HTML_URL,
        "/images/logo-offline.png"
    ]);

    workbox.routing.setDefaultHandler(
        new NetworkOnly()
    );
    workbox.routing.setCatchHandler(({ event }) => {
        switch (event.request.destination) {
            case 'document':
                return caches.match(FALLBACK_HTML_URL);
            default:
                return Response.error();
        }
    });
    
    // Javascript and CSS rule
    registerRoute(
        new RegExp("/(js|css|images|fonts)/.*"),
        new StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-assets`,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 50
                })
            ]
        })
    );

    // Javascript and CSS rule (from CDN)
    registerRoute(
        /^https?:\/\/futboltv\.b-cdn\.net\/.*(js|css|images|fonts|icons)\/.*$/,
        new StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-cdn-assets`,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 50
                })
            ]
        })
    );

    // External Javascript and CSS rule
    registerRoute(
        /^.*(js|css)$/,
        new StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-externalAssets`,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 20,
                }),
                new CacheableResponsePlugin({
                    statuses: [200]
                })
            ],
            matchOptions: {
                ignoreSearch: true
            }
        })
    );

    // Logos
    registerRoute(
        /^https?:\/\/sportstv-img\.b-cdn\.net\/.*(teams|competitions|channels)\/.*(png|jpg|webp)$/,
        new StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-logos`,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 100
                })
            ]
        })
    );

    // Google Fonts
    registerRoute(
        ({ url }) => url.origin === 'https://fonts.googleapis.com',
        new StaleWhileRevalidate({
            cacheName: `${CACHE_PREFIX}-googleFontsStylesheets`,
        })
    );

    // Cache the underlying font files with a cache-first strategy for 1 year.
    registerRoute(
        ({ url }) => url.origin === 'https://fonts.gstatic.com',
        new CacheFirst({
            cacheName: `${CACHE_PREFIX}-googleFontsWebfonts`,
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new ExpirationPlugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );
} else {
    console.log("Boo! Workbox didn't load.");
}