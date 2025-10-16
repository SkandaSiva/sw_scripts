const offline = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";
const filesToCache = [
    '/CSS/main.min.css',
    '/img/logo-watermark-dark@1x.svg',
    '/offline.html',
];

const staticCacheName = 'pages-cache-v6';

self.addEventListener("install", (event) => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            // Enable navigation preload if it's supported.
            // See https://developers.google.com/web/updates/2017/02/navigation-preload
            if ("navigationPreload" in self.registration) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    // First, try to use the navigation preload response if it's supported.
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    // Always try the network first.
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    // catch is only triggered if an exception is thrown, which is likely
                    // due to a network error.
                    // If fetch() returns a valid HTTP response with a response code in
                    // the 4xx or 5xx range, the catch() will NOT be called.
                    console.log("Fetch failed; returning offline page instead.", error);

                    if (event.request.referrer && event.request.url !== event.request.referrer) {
                        const response = await fetch(event.request.referrer);
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            const cache = await caches.open(staticCacheName);
                            const cachedResponse = await cache.match(OFFLINE_URL);
                            return cachedResponse;
                        }
                        return response;
                    }
                    else {
                        const cache = await caches.open(staticCacheName);
                        const cachedResponse = await cache.match(OFFLINE_URL);
                        return cachedResponse;
                    }
                }
            })()
        );
    }
});