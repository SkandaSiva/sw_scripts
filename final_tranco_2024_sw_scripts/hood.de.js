// This is the "Offline page" service worker

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.setConfig({
  debug: false,
  injectServiceWorker: true,
});

/*
const {registerRoute} = workbox.routing;
const {NetworkOnly} = workbox.strategies;
const {NavigationRoute} = workbox.routing;
*/

const CACHE = "hoodSWcache2";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.htm";

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
  // workbox.navigationPreload.disable();
}

/*
registerRoute(
  ({url}) => url.pathname.startsWith('/shuttleBay/'),
  new NetworkOnly()
);
*/ 




self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' || event.request.mode === 'no-cors') {
   
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      // return
    } else {
      if (event.request.method == 'GET') {
        event.respondWith((async () => {
            try {
            
              /* const preloadResp = await event.preloadResponse;
    
            if (preloadResp) {
              return preloadResp;
            }*/
    
            const networkResp = await fetch(event.request);
            return networkResp;
          } catch (error) {
            const cache = await caches.open(CACHE);
            const cachedResp = await cache.match(offlineFallbackPage);
            return cachedResp;
          }
          
        })());
    } else {
    }
    }
  } else {
   
  }
});
