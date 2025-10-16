const VERSION = 2;
const CACHE_NAME = `achareh-static-asstets-v${VERSION}`;
const PRECACHE_ASSETS = [
  "/offline.html",
]


self.addEventListener('install', function (event) {
  event.waitUntil(precache());
  event.waitUntil(self.skipWaiting());
})

self.addEventListener("fetch", function(event) {
  const request = event.request;
  if (request.method === 'GET' && request.mode === "navigate") {
    event.respondWith(fetch(request).catch(respondWithOfflinePage));
  }
})

function precache() {
  return caches.open(CACHE_NAME)
          .then((cacheResult) => cacheResult.addAll(PRECACHE_ASSETS))
          .catch((err) => console.log("An error ocurred on precaching", err));
}

function respondWithOfflinePage(error) {
  console.error("[onfetch] Failed. Serving cached offline fallback", error);

  return caches.open(CACHE_NAME)
    .then((cacheResult) => cacheResult.match("/offline.html"));
}
