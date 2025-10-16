/** GESTION DU CACHE - Service WORKER
 * Version du 28/02/2020
 **/
var CACHE_NAME = 'WWW-TIROKDO-' + "1702419728";
const OFFLINE_URL = '/error_OffLineMode';
const OFFLINE_CSS = '/im/style_v2.css';
const PRE_CACHED_RESOURCES = ["/error_OffLineMode", "/im/style_v2.css", "/im/awesome_icon/css/all.css", "/im/error_50x.png","/im/logo-red-fr.svg","/manifest.json","/im/utils_v2.js"];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
         // await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
        await cache.addAll(PRE_CACHED_RESOURCES);
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());
    self.clients.claim();
});


self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                console.log('Fetch failed; returning offline page instead.', error);
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);

                return cachedResponse;
            }
        })());
    }
});