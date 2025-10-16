const precacheVersion = 2;
const precacheName = 'precache-v' + precacheVersion;
const precacheFiles = [
    "/offline.html",
    "/img/main/favicon.ico",
    "/img/icon-192x192.png",
    "/img/viber-logo.png",
    "/img/logo.png",
    "/manifest.json",
    "/img/body-back.png",
    "/img/icon-phone.png"
];

self.addEventListener('install', (e) => {

  self.skipWaiting();

  e.waitUntil(
    caches.open(precacheName).then((cache) => {
      console.log('[ServiceWorker] Precaching files');
      return cache.addAll(precacheFiles);
    }) // end caches.open()
  ); // end e.waitUntil
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {

        if (thisCacheName.includes("precache") && thisCacheName !== precacheName) {
          return caches.delete(thisCacheName);
        }

      }));
    }) // end caches.keys()
  ); // end e.waitUntil
});

self.addEventListener('fetch', (e) => {

  e.respondWith(
    caches.match(e.request)
      .then((response) => {

        if (response) {
          return response;
        }

        return fetch(e.request)
          .then((fetchResponse) => fetchResponse)
          .catch((err) => {
            const isHTMLPage = e.request.method === "GET" && e.request.headers.get("accept") !== null && e.request.headers.get("accept").includes("text/html");
            if (isHTMLPage) return caches.match("/offline.html");
          });

    }) // end caches.match(e.request)
  ); // end e.respondWith
});
