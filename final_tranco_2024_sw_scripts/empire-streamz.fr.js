const versionCache = "cache-v1.0";

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const cache = await caches.open(versionCache);
            if (cache) {
                cache.add(new Request("/offline"))
            }
        })()
    )
})

self.addEventListener('activate', () => {
    clients.claim()
})

self.addEventListener('fetch', (event) => {
    var _url = event.request.url;
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadReponse = await event.preloadResponse;
                    if (preloadReponse) {
                        return preloadReponse;
                    }
                    return await fetch(event.request)
                } catch (e) {
                    const cache = await caches.open(versionCache);
                    return await cache.match("offline")
                }
            })()
        )
    }
})