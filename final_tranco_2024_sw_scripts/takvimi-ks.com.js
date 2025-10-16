//--------------------------------------------------------------------------
// You can find dozens of practical, detailed, and working examples of
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

// Version
var VERSION = "1.0.2";

// Cache name
var CACHE_NAME = "cache-version-" + VERSION;

// Files
var REQUIRED_FILES = [
  "/assets/img/favicon.svg",
  "/assets/img/icon/72x72.png",
  "/assets/img/icon/96x96.png",
  "/assets/img/icon/128x128.png",
  "/assets/img/icon/144x144.png",
  "/assets/img/icon/152x152.png",
  "/assets/img/icon/192x192.png",
  "/assets/img/icon/384x384.png",
  "/assets/img/icon/512x512.png",
  "/assets/img/logo.svg",
  "/assets/img/kohet/festat.webp",
  "/assets/img/kohet/sabahu.webp",
  "/assets/img/kohet/lindja-e-diellit.webp",
  "/assets/img/kohet/dreka.webp",
  "/assets/img/kohet/ikindia.webp",
  "/assets/img/kohet/akshami.webp",
  "/assets/img/kohet/jacia.webp",
  "/assets/img/kohet/gjatesia-e-dites.webp",
  "/assets/css/style.css",
  "/assets/js/lib/bootstrap.bundle.min.js",
  "/assets/js/base.js",
];

self.addEventListener("install", function (event) {
  // Perform install step:  loading each required file into cache
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        // Add all offline dependencies to the cache
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return the response from the cached version
      if (response) {
        return response;
      }
      // Not in cache - return the result from the live server
      // `fetch` is essentially a "fallback"
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", function (event) {
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
});
