importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

registerRoute(
    ({request}) => request.mode === 'navigate',
    new NetworkFirst({
        cacheName: 'pages',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [ 200 ],
            })
        ],
    })
);

registerRoute(
    ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
    new StaleWhileRevalidate({
        cacheName: 'static',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [ 200 ],
            })
        ],
    })
);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [ 200 ],
            }),
            new ExpirationPlugin({
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30,
            }),
        ],
    })
);

registerRoute(
    ({request}) => request.destination === 'font',
    new CacheFirst({
        cacheName: 'fonts',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [ 200 ],
            })
        ],
    })
);