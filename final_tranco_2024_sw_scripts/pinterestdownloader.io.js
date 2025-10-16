importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js");

const { registerRoute } = workbox.routing;
const { NavigationRoute } = workbox.routing;
// const {navigationPreload} = workbox.navigationPreload;
const { NetworkOnly } = workbox.strategies;
const { StaleWhileRevalidate } = workbox.strategies;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

// registerRoute(/\/$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);
registerRoute(
    ({ request }) => request.destination === 'script' ||
        request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);
const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline.html';
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL))
    );
});

// navigationPreload.enable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
    try {
        return await networkOnly.handle(params);
    } catch (error) {
        return caches.match(FALLBACK_HTML_URL, {
            cacheName: CACHE_NAME,
        });
    }
};

registerRoute(
    new NavigationRoute(navigationHandler)
);