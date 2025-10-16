let CACHE_VERSION = 1,
    CURRENT_CACHE = 'static-cache-v' + CACHE_VERSION;

// Installing Service-Worker
self.addEventListener('install' , (event) => {
    // Cache some static files
    event.waitUntil(
        caches.open(CURRENT_CACHE)
            .then(cache => {
                const assets = [
                        '/offline',
                        '/assets/vendor/bootstrap/css/bootstrap.rtl.min.css',
                        '/assets/css/stylesheet.min.css',
                        '/assets/css/application.min.css',
                        '/assets/fonts/Peyda/woff/PeydaWebFaNum-Regular.woff',
                        '/assets/fonts/Peyda/woff2/PeydaWebFaNum-Regular.woff2',
                        '/assets/fonts/Peyda/woff/PeydaWebFaNum-Bold.woff',
                        '/assets/fonts/Peyda/woff2/PeydaWebFaNum-Bold.woff2',
                        '/assets/vendor/jquery/jquery-3.7.1.min.js',
                        '/assets/images/person/offline.svg',
                        '/favicon.svg',
                        '/favicon.ico',
                    ],
                    stack = [];
                assets.forEach(file => stack.push(
                    cache.add(file).catch(_=>console.error(`can't load ${file} to cache`))
                ));
                return Promise.all(stack);
            }
        )
    );
})

// Activating Service-Worker
self.addEventListener('activate' , (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            (async () => {
                // Enable navigation preload if it's supported.
                // See https://developers.google.com/web/updates/2017/02/navigation-preload
                if ("navigationPreload" in self.registration) {
                    await self.registration.navigationPreload.enable();
                }

                return Promise.all(
                    cacheNames.map(cacheName => {
                        if ( CURRENT_CACHE !== cacheName ) {
                            caches.delete(cacheName);
                        }
                    })
                )
            })()
        })
    );

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

// Event on fetch of requests
self.addEventListener('fetch' , (event) => {
    // Work only on pages
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                    const cache = await caches.open(CURRENT_CACHE);

                    try {
                        // First, try to use the navigation preload response if it's supported.
                        const preloadResponse = await event.preloadResponse;
                        if (preloadResponse) {
                            return preloadResponse;
                        }

                        // Second, try to use caches
                        // const cachedResponse = await cache.match(event.request);
                        // if (cachedResponse) {
                        //     return cachedResponse;
                        // }

                        // Third, fetch online file
                        const fetchResponse = await fetch(event.request);
                        if (fetchResponse) {
                            return fetchResponse;
                        }
                    } catch (error) {
                        console.log("Fetch failed; returning cached page instead.", error);
                        return await cache.match('/offline');
                    }
                }
            )());
    }
});

// On push event
self.addEventListener("push", (function(event) {
    if (self.Notification && "granted" === self.Notification.permission && event.data) {
        let decoded_data = event.data.json();
        if ( decoded_data.hasOwnProperty("body") ) {
            event.waitUntil( self.registration.showNotification(decoded_data.title, decoded_data) )
        }
    }
}))

// On click on push notification event
self.addEventListener("notificationclick", (function(event) {
    let notification_data = event.notification.data;
    event.notification.close();
    let notification_page_link = "/notifications";
    if ( notification_data.hasOwnProperty("url") ) {
        clients.openWindow(notification_data.url)
    }
    else {
        clients.openWindow(notification_page_link)
    }
}));
