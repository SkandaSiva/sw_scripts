importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const SW_VERSION = 1;
const CACHE_LIFETIME = 31556952;
const {registerRoute, NavigationRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {CacheFirst, NetworkOnly, StaleWhileRevalidate} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;



// Pre-cache fallback responses
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offline_page_only
// #####################################
const OFFLINE_CACHE_NAME = 'offline-html';
const OFFLINE_FALLBACK_HTML_URL = 'https://www.perfumeprice.co.uk/offline';

// Populate the cache with the offline HTML page when the
// service worker is installed.
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE_NAME)
            .then((cache) => cache.add(OFFLINE_FALLBACK_HTML_URL))
    );
});

workbox.navigationPreload.enable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
    try {
        // Attempt a network request.
        return await networkOnly.handle(params);
    } catch (error) {
        // If it fails, return the cached HTML.
        return caches.match(OFFLINE_FALLBACK_HTML_URL, {
            cacheName: OFFLINE_CACHE_NAME,
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
                new ExpirationPlugin({
                    maxAgeSeconds: CACHE_LIFETIME,
                    maxEntries: 1
                })
            ]
        });
    }
};

// Register this strategy to handle all navigations.
registerRoute(new NavigationRoute(navigationHandler));


registerRoute(
    /^(.*)(static)(.*)(.(png|jpeg|jpg|gif|svg|css|js|woff|woff2|ttf|eot|ico|json))$/,
    new StaleWhileRevalidate({
        cacheName: 'static-assets',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxAgeSeconds: CACHE_LIFETIME,
                maxEntries: 1000
            })
        ]
    })
);

registerRoute(
    /^(.*)(media)(.*)(.(png|jpeg|jpg|gif|css|js|svg|pdf))$/,
    new StaleWhileRevalidate({
        cacheName: 'media-assets',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxAgeSeconds: CACHE_LIFETIME,
                maxEntries: 5000
            })
        ]
    })
);

// Cache fonts
// https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts
// #####################################
registerRoute(function (_ref) {
    var url = _ref.url;
    return url.origin === 'https://fonts.gstatic.com';
}, new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200]
        }),
        new ExpirationPlugin({
            maxAgeSeconds: CACHE_LIFETIME,
            maxEntries: 30
        })
    ]
}));

registerRoute(
    function (_ref) {
        var url = _ref.url;
        return url.origin === 'https://fonts.googleapis.com';
    },
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxAgeSeconds: CACHE_LIFETIME,
                maxEntries: 30
            })
        ]
    })
);
