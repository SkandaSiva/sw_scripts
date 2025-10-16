const offlineUrl = "/offline";
const PRECACHE = "precache-v4";
const RUNTIME = "runtime";

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    "/favicon.ico",
    "/img/logo.svg",
    "/img/raw.png",
    "/fonts/iransans.woff2",
    "/fonts/nicon.woff2",
    "/manifest.json",
    "/js/lazi.min.js",
    "/img/android-chrome-192x192.png",
    "/img/android-chrome-512x512.png",
    offlineUrl
];

const filesUpdate = cache => {
    const stack = [];
    PRECACHE_URLS.forEach(file => stack.push(
        cache.add(file).catch(_ => console.error(`can't load ${file} to cache`))
    ));
    return Promise.all(stack);
};

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install",
    event => {
        event.waitUntil(
            caches.open(PRECACHE)
            .then(filesUpdate)
            .then(self.skipWaiting())
        );
    });

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate",
    event => {
        const currentCaches = [PRECACHE, RUNTIME];
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
            }).then(cachesToDelete => {
                return Promise.all(cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
                }));
            }).then(() => self.clients.claim())
        );
    });

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener("fetch",
    event => {
        // Skip cross-origin requests, like those for Google Analytics.
        if (event.request.url.startsWith(self.location.origin) &&
            event.request.method === "GET" &&
            !event.request.headers.get("accept").includes("text/html")) {
            event.respondWith(
                caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return caches.open(RUNTIME).then(cache => {
                        return fetch(event.request).then(response => {
                            // Put a copy of the response in the runtime cache.
//                            console.log("copy response: " +  (event.request.url));
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            });
                        });
                    });
                })
            );
        }
    });