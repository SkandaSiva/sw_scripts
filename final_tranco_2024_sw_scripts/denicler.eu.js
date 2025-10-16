importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const SW_VERSION = 1;
const CACHE_LIFETIME = 31556952;
const {registerRoute, NavigationRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {CacheFirst, NetworkOnly, StaleWhileRevalidate} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;

const {skipWaiting} = workbox.core;
skipWaiting();

const {clientsClaim} = workbox.core;
clientsClaim();
const OFFLINE_CACHE_NAME = 'offline-html';
const OFFLINE_FALLBACK_HTML_URL = 'home';


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
        return await networkOnly.handle(params);
    } catch (error) {
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
                maxEntries: 100
            })
        ]
    })
);


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

