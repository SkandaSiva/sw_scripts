let cacheName = "offline";

self.addEventListener("install", function(event) {
    event.waitUntil(
        (async () => {
            let cache = await caches.open(cacheName);
            await cache.addAll(["/pwa/offline.html", "/pwa/offline-cat.gif", "/img/logo.png"]);
        })(),
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            if ("navigationPreload" in self.registration) {
                await self.registration.navigationPreload.enable();
            }
        })(),
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                let cache = await caches.open(cacheName);
                try {
                    let cachedResponse = await cache.match(event.request);
                    if (cachedResponse) return cachedResponse;

                    let preloadResponse = await event.preloadResponse;
                    if (preloadResponse) return preloadResponse;

                    let response = await fetch(event.request);
                    if (response) return response;

                    throw new Error("Failed request");
                } catch {
                    return await cache.match("/pwa/offline.html");
                }
            })(),
        );
    }
});