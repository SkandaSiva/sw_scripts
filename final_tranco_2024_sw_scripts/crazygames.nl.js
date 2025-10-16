// https://googlechrome.github.io/samples/service-worker/custom-offline-page/

const CACHE_NAME = 'CG_GLOBAL_OFFLINE';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.add(OFFLINE_URL);
    })(),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' && !event.request.url.includes('/gameframe/')) {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })(),
    );
  }
});
