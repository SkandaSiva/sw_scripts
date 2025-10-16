const CACHE_NAME = "static-cache-v1";

const FILES_TO_CACHE = ["/offline"];

self.addEventListener("install", (evt) => {
  // console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)),
    // console.log('[ServiceWorker] Pre-caching offline page');
  );

  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  // console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            // console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }

          return null;
        }),
      ),
    ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  // console.log('[ServiceWorker] Fetch', evt.request.url);
  if (evt.request.mode !== "navigate") {
    // Not a page navigation, bail.
    return;
  }

  if (evt.request.url.indexOf("/redirect") > -1) {
    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(() => caches.open(CACHE_NAME).then((cache) => cache.match("offline"))),
  );
});
