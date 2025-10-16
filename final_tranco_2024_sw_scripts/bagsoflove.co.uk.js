importScripts('libs/workbox/workbox-sw.js');
importScripts('libs/workbox/6.1.5/workbox-core.js');
importScripts('libs/workbox/6.1.5/workbox-expiration.js');
importScripts('libs/workbox/6.1.5/workbox-routing.js');
importScripts('libs/workbox/6.1.5/workbox-fastest.js');
importScripts('libs/workbox/6.1.5/workbox-cache.js');

//importScripts('libs/workbox/workbox-backgroundsync.js') For test Active code;

self.skipWaiting();


//import { ExpirationPlugin } from 'workbox-expiration';
const staticCacheName = 'bol-cache';
const bolDynamic = 'bol-dynamicassests';
const bolStyle = 'bol-styleassests';
const imageCacheName = 'image-cache';

const assets = [
    "/"
];

const cachefirstassests = [
    ["/webpackstatic.axd?bundle=BolJQueryJs", 24 * 60 * 60],
    ["/webpackstatic.axd?bundle=BolJquerylib", 24 * 60 * 60],
    ["/webpackstatic.axd?bundle=CookieLoader", 24 * 60 * 60],
    [".woff2", 30 * 24 * 60 * 60],
    [".woff", 30 * 24 * 60 * 60],
    ["use.typekit.net", 30 * 24 * 60 * 60],
    [".ttf", 30 * 24 * 60 * 60]
];


const StaleWhileRevalidateAssets = [
    "webpackdynamic.axd",
];

const StaleWhileRevalidateAssetsCss = [
    "webpackcss.axd",
];

// Install the service worker.
self.addEventListener('install', evt => {

    evt.waitUntil(
        caches.open(staticCacheName).then(c => {
            console.log('caching assests');
            //c.addAll(assets);
        }))
});

// activate event
self.addEventListener('activate', function (e) {
    e.waitUntil((async () => {
        const cacheNames = [staticCacheName, bolDynamic, bolStyle, imageCacheName];

        await Promise.all(cacheNames.map(async (cacheName) => {
            if (self.cacheName !== cacheName) {
                await caches.delete(cacheName);
            }
        }));
    })());
});


cachefirstassests.forEach((assest) => {


    workbox.routing.registerRoute(
        ({ request }) => { return assest.some(x => request.url.includes(x)) },
        new workbox.strategies.CacheFirst({
            cacheName: staticCacheName,
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: assest[1] // 24 hours
                }),
            ],
        })
    );

});

workbox.routing.registerRoute(
    new RegExp('https://raven.*\.{1}[^(svg)].*$'),
    new workbox.strategies.CacheFirst({
        cacheName: imageCacheName,
        plugins: [            
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50

            }),
        ]
    }),
);



workbox.routing.registerRoute(
    ({ request }) => { return StaleWhileRevalidateAssets.some(x => request.url.includes(x)) },
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: bolDynamic
    })
);

workbox.routing.registerRoute(
    ({ request }) => { return StaleWhileRevalidateAssetsCss.some(x => request.url.includes(x)) },
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: bolStyle
    })
);

//workbox.routing.registerRoute(
//    ({ request }) => { return (request.destination === 'style') && !cachonlyassets.some(x => request.url.includes(x)) },
//    new workbox.strategies.StaleWhileRevalidate({
//        cacheName: 'CssAssests'
//    })
//);

