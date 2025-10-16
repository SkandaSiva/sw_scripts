/**
 * PWA — easy way to Progressive Web App - 1.6.4
 */
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open('iworks-pwa-offline-cache-1');
        await cache.add(new Request('iworks-pwa-offline', {
                cache: 'reload'
            }));
        caches.open('iworks-pwa-offline-cache-1').then(function(cache) {
            return cache.addAll([ 'https://avapedia.com', 'https://avapedia.com/%d8%b3%db%8c%d8%a7%d8%b3%d8%aa-%d8%ad%d9%81%d8%b8-%d8%ad%d8%b1%db%8c%d9%85-%d8%ae%d8%b5%d9%88%d8%b5%db%8c/' ]);
        });
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());
    self.clients.claim();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return 'iworks-pwa-offline-cache-1' !== cacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // First, try to use the navigation preload response if it's supported.
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                // console.log('Fetch failed; returning offline page instead.', error);
                const cache = await caches.open('iworks-pwa-offline-cache-1');
                const cachedResponse = await cache.match('iworks-pwa-offline');
                return cachedResponse;
            }
        })());
    }
});
