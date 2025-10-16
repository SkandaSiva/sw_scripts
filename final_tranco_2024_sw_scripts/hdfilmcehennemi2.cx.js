importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
"use strict";

workbox.routing.registerRoute(
    /\.(js|css)/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'Assets'
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'WebFontCss',
    }),
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'WebFonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
            }),
        ],
    }),
);
workbox.routing.registerRoute(
    /\.(jpg|jpeg|gif|webp|png)/,
    workbox.strategies.cacheFirst({
        cacheName: 'Images',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 604800,
                maxEntries: 500,
                purgeOnQuotaError: !0
            })
        ]}));