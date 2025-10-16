importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "ftOfflinePage";

const offlineFallbackPage = "/offline.html";

const urlsToCache = [
    offlineFallbackPage,
    '/media/wysiwyg/wifi_gone_4.jpg',
    '/media/wysiwyg/FT_Short_Logo_2.jpg'
];

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
		.then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    if (
        event.request.url.match( '/.*admin.*(/.*)?' ) !== -1 ||
        event.request.url.startsWith('/dpa')
    ) {
        return false;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;

                if (preloadResp) {
                    return preloadResp;
                }

                const networkResp = await fetch(event.request);
                return networkResp;
            } catch (error) {

                const cache = await caches.open(CACHE);
                const cachedResp = await cache.match(offlineFallbackPage);
                return cachedResp;
            }
        })());
    }
});
