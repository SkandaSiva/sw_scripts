/**
 * PWA — easy way to Progressive Web App - 1.6.4
 */
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open('iworks-pwa-offline-cache-pl-2');
        await cache.add(new Request('iworks-pwa-offline', {
                cache: 'reload'
            }));
        caches.open('iworks-pwa-offline-cache-pl-2').then(function(cache) {
            return cache.addAll([ 'https://opi.org.pl', 'https://opi.org.pl/polityka-prywatnosci/' ]);
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
                    return 'iworks-pwa-offline-cache-pl-2' !== cacheName;
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
                const cache = await caches.open('iworks-pwa-offline-cache-pl-2');
                const cachedResponse = await cache.match('iworks-pwa-offline');
                return cachedResponse;
            }
        })());
    }
});
