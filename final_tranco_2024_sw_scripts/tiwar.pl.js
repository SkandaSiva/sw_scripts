var cacheName = "tiwar";
var version = 2;

function getFullCacheName() {
    return cacheName + "_" + version;
}

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(cleanInvalidCacheStorage());
});

function cleanInvalidCacheStorage() {
    return caches.keys().then(keys => {
        return Promise.all(
            keys.filter(key => key.startsWith(cacheName) && key !== getFullCacheName())
                .map(key => caches.delete(key))
        )
    });
}

self.addEventListener("fetch", event => {
    const requestURL = new URL(event.request.url)
    if (requestURL.hostname !== self.location.hostname || !/\.(png|jpg|webp|gif|w|css|js)$/.test(requestURL.pathname)) {
        return;
    }
    // Cached
    event.respondWith(
        caches.open(getFullCacheName()).then(cache =>
            cache.match(event.request).then(response =>
                response || fetch(event.request).then(response => {
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
            )
        )
    )
});
