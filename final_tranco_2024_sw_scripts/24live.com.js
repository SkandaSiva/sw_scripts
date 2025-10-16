/* eslint-disable */

self.addEventListener('push', function (e) {
    console.log('New Push notification ', JSON.stringify(e.data.json()));
    var body = '';
    if (e.data) {
        body = e.data.json();
    } else {
        body = JSON.stringify(e);
    }
    var options = {
        body: body.msg,
        icon: body.icon,
        badge: body.badge,
        vibrate: [100, 50, 100],
        data: {
            primaryKey: body.id,
            host: body.hostname,
            path: body.path,
        },
    };
    e.waitUntil(self.registration.showNotification(body.title, options));
});

self.addEventListener('notificationclose', function (e) {
    var notification = e.notification;
    console.log('Closed notification ');
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var host = notification.data.host;
    var id = notification.data.primaryKey;
    var path = notification.data.path;
    clients.openWindow('https://' + host + path);
    notification.close();
});

// const urlsToCache = ['/', 'app.js', 'styles.css', 'logo.svg'];
// self.addEventListener('install', (event) => {
//     event.waitUntil(async () => {
//         const cache = await caches.open('pwa-assets');
//         return cache.addAll(urlsToCache);
//     });
// });

const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = 'offline/offline.html';

self.addEventListener('install', (event) => {
    console.log(`Service worker successfully installed`);
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            // Setting {cache: 'reload'} in the new request will ensure that the response
            // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
            await cache.add(new Request(OFFLINE_URL));
            await cache.add(new Request('offline/offline.webp'));
            await cache.add(new Request('offline/24live.css'));
            await cache.add(new Request('offline/styles.css'));
            await cache.add(new Request('img/24live.png'));
            await cache.add(new Request('manifest.json', { cache: 'force-cache' }));
            await cache.add(
                new Request('https://fonts.googleapis.com/icon?family=Material+Icons', { cache: 'reload' })
            );
        })()
    );
});

self.addEventListener('fetch', async (event) => {
    var url = event.request.url;

    const inCache = url.includes('offline') || url.includes('24live.png') || url.includes('page');

    if (event.request.method !== 'GET' || !inCache) {
        return;
    }
    // console.log(`URL requested: ${url}`);

    event.respondWith(
        (async () => {
            try {
                const serverResponse = await fetch(event.request);

                // It can update the cache to serve updated content on the next request
                return serverResponse;
            } catch (e) {
                if (event.request.mode === 'navigate') {
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                } else {
                    return caches.match(event.request);
                }
            }
        })()
    );

    // var requestURL = new URL(event.request.url);

    //
    //     if (!cachedResponse) {
    //         return;
    //     }
    //     event.respondWith(
    //         (async () => {
    //             let validMimeType = false;

    //             if (/(\.js|\.css|\.png|\.svg|\.jpg|\.gif|\.json|\.woff|\.ttf|\.ico|\.webp)/.test(url)) {
    //                 validMimeType = true;
    //             }

    //             if (url.includes('service-worker') || requestURL.origin != location.origin) {
    //                 validMimeType = false;
    //             }

    //                const caches.match(event.request);
    //             // const cache = await caches.open('pwa-assets');

    //             if (cachedResponse && validMimeType) {
    //                 console.log(`Response from cache: ${url}`);
    //                 return cachedResponse;
    //             }

    //             try {
    //                 const serverResponse = await fetch(event.request);

    //                 if (validMimeType) {
    //                     // TODO this code will add to cache all valid Mime types, now we render only offline.html so we do not need this
    //                     //event.waitUntil(cache.put(event.request, serverResponse.clone()));
    //                     //console.log(`Add to cache: ${url}`);
    //                 }

    //                 // It can update the cache to serve updated content on the next request
    //                 return serverResponse;
    //             } catch (e) {
    //                 if (event.request.mode === 'navigate') {
    //                     const cache = await caches.open(CACHE_NAME);
    //                     const cachedResponse = await cache.match(OFFLINE_URL);
    //                     return cachedResponse;
    //                 }
    //             }
    //         })()
    //     );
    //
});

// const staticCacheName = "site-static-v1";
// self.addEventListener("install", (event) => {
//     event.waitUntil(self.skipWaiting());
// });
//
// self.addEventListener("message", (event) => {
//     if (event.data.type === "CACHE_URLS") {
//         event.waitUntil(
//             caches.open(staticCacheName).then((cache) => {
//                 return cache.addAll(event.data.payload);
//             })
//         );
//     }
// });
//
// // activate event
// self.addEventListener("activate", (evt) => {
//     evt.waitUntil(
//         caches.keys().then((keys) => {
//             return Promise.all(
//                 keys
//                     .filter((key) => key !== staticCacheName)
//                     .map((key) => caches.delete(key))
//             );
//         })
//     );
// });
// // fetch event
// self.addEventListener("fetch", (evt) => {
//     if (
//         evt.request.cache === "only-if-cached" &&
//         evt.request.mode !== "same-origin"
//     ) {
//         return;
//     }
//     evt.respondWith(
//         caches.match(evt.request).then((cacheRes) => {
//             return cacheRes || fetch(evt.request);
//         })
//     );
// });
