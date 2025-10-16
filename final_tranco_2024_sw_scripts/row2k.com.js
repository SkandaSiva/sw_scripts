// version: 0.99.500
// latest updates: css change, video
// updated: 7/2/2024
// 
// ARE WE EVER GETTING TO VERSION 1.0????

var CACHE_NAME = 'static-cache-v41';
var DATA_CACHE_NAME = 'data-cache-v3';

var CACHED_URLS = [
  "/graphics/row2klogoS_reg.gif",
  "/includes/js/nav.resp.js",
  "/includes/js/engine.js",
  "/includes/js/swipe.js",
  "/includes/js/tw-fb.js",
  "/includes/resp/copyright.html",
  "/includes/css/nav-resp.css",
  "/includes/css/classifieds.css",
  "/includes/css/row2k-body-resp.css",
  "/includes/css/row2k-resp.css",  
  "/includes/css/features.css",  
  "/favicon.ico",
  "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",
  "https://fonts.googleapis.com/css?family=Lato:100,400,700,900",
  "https://fonts.googleapis.com/css?family=Passion+One:400,700"
]

/** caching install */
self.addEventListener("install", function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  if (event.request.url.match( '^.*(\/admin\/).*$' ) ) {
    return false;
  }
  if (CACHED_URLS.includes(requestURL.href) || CACHED_URLS.includes(requestURL.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
      })
    );
  }
  else {
    event.respondWith(
    fetch(event.request)
    );
  }
});

/** clear old caches */
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("static-cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});



/*
self.addEventListener('fetch', (event) => {
  event.respondWith(async function() {
    const response = await caches.match(event.request);
    return response || fetch(event.request);
  }());
});

*/