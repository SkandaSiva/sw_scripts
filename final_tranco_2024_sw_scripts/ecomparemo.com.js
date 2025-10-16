const cacheName = `cache-${location.host}`
const imgRoot = '/wp-content/themes/cms/img'
const cachedImgs = [
    // `${imgRoot}/ecomparemo-splash-screen-icon.png`,
    // `${imgRoot}/ecomparemo-android-touch-icon.png`,
    // `${imgRoot}/ecomparemo-maskable-touch-icon.png`
]

// Installing Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async() => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(cachedImgs);
    })())
})

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    e.respondWith((async() => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if(r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        await cache.put(e.request, response.clone());
        return response;
    })())
})