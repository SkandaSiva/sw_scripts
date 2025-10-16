'use strict';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

const {matchPrecache} = workbox.precaching;
const {setCatchHandler, registerRoute} = workbox.routing;
const {ExpirationPlugin} = workbox.expiration;
const {CacheFirst, StaleWhileRevalidate, NetworkOnly, NetworkFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

const offlineFiles = [
    '/offline/',
    '/assets/css/sa-totaal.css',
    '/assets/css/bootstrap-min.css'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(self.caches.open('workbox-offline-fallbacks').then(cache => cache.addAll(offlineFiles)));
});

const handler = async (options) => {
    const dest = options.request.destination;
    const cache = await self.caches.open('workbox-offline-fallbacks');

    if (dest === 'document') {
        return (await cache.match('/offline/')) || Response.error();
    }

    return Response.error();
};

setCatchHandler(handler);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 14 * 24 * 60 * 60
            }),
        ],
    })
);

registerRoute(
    ({url}) => url.href.startsWith("https://www.studioalphen.nl/assets/fonts/"),
    new CacheFirst({
        cacheName: 'google-fonts-webfonts',
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

registerRoute(
    ({request}) => request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);

registerRoute(
    ({url}) => url.origin === 'https://use.fontawesome.com/',
    new CacheFirst(),
);

registerRoute(
    ({url}) => [
        "http://www.studioalphen.nl/",
        "https://www.studioalphen.nl/",
        "https://www.studioalphen.nl/?source=pwa_start"
    ].includes(url.href) || url.href.startsWith("https://www.studioalphen.nl/kernen/") || url.href.startsWith("https://www.studioalphen.nl/nieuws/"),
    new StaleWhileRevalidate({
        cacheName: 'pages',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 60
            }),
        ],
    })
);

registerRoute(
    ({url}) => url.href.startsWith("https://www.studioalphen.nl/admin") || url.href.startsWith("https://www.studioalphen.nl/systeembeheer"),
    new NetworkOnly({
    })
);

registerRoute(
    ({request, url}) => request.destination === 'document' && (
        url.href.startsWith("https://www.studioalphen.nl/radio/") ||
        url.href.startsWith("https://www.studioalphen.nl/televisie/")
    ),
    new StaleWhileRevalidate({
        cacheName: 'pages',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 20 * 60 * 60
            }),
        ],
    })
);

registerRoute(
    ({request, url}) => request.destination === 'document' && (
        url.href.startsWith("https://www.studioalphen.nl/omroep/")
    ),
    new StaleWhileRevalidate({
        cacheName: 'pages',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 13 * 24 * 60 * 60
            }),
        ],
    })
);
