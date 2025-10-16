// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "lokmatnews-PWA";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "/404/";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('\.css'),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE
  })
);


// workbox.routing.registerRoute(
//   new RegExp('^https://d3pc1xvrcw35tl\\.cloudfront\\.net/.*\\.(js|css|png|jpg)$', 'i'),
//   new workbox.strategies.CacheFirst()
// );

self.addEventListener('fetch', (event) => {
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

var izCacheVer = "1"; 
importScripts("https://cdn.izooto.com/scripts/workers/49f34b171d4ab973d2c81ab4c1378f91441ac407.js");