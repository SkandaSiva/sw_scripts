const cacheName = '2GO-PWA-v1';
const staticAssets = [];

self.addEventListener('install', async () => {
    /**
     * Disabled caching for now as it didn't provide any real speed improvements over the standard browser cache,
     * and the offline functionality also isn't working properly,
     * and it causes some requests to be fired twice.
     */
   // const cache = await caches.open(cacheName);
   // await cache.addAll(staticAssets);
});

self.addEventListener('fetch', e => {
    // const req = e.request;

    // if (/\/chat\//.test(req.url) || req.method == 'POST') {
        // fetch(req);
    // } else if(req.destination == 'style' || req.destination == 'script' || req.destination == 'image' || req.destination == 'font') {
        // const result = cacheFirst(req);
        // e.respondWith(result);
    // } else {
        // const result = networkFirst(req);
        // e.respondWith(result);
    // }
});

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        if (fresh.type != 'opaque') {
            cache.put(req, fresh.clone());
        }

        return fresh;
    } catch (e) {
        return await cache.match(req);
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}