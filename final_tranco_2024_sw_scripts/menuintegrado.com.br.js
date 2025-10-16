const CACHE_NAME = 'v1:sw-cache-';
const URLS_TO_CACHE = [];

function onInstall(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)),
  );
}

function onActivate(event) {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (URLS_TO_CACHE.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      }),
    )),
  );
}

// Borrowed from https://github.com/TalAter/UpUp
function onFetch(event) {
  event.respondWith(
    // try to return untouched request from network first
    fetch(event.request).catch(() =>
      // if it fails, try to return request from the cache
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
      })),
  );
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
