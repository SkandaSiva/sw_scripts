
const CACHE = "oneorg-1728566924714";
const theme_path = 'wp-content/themes/oneorg/';

// This is the service worker with the Cache-first network
const precacheFiles = [
  /* Add an array of files to precache for your app */
  theme_path + 'dist/html/offline.html', 
  theme_path + 'dist/css/main.css', 
  theme_path + 'dist/js/app.min.js',
  theme_path + 'dist/images/fav/favicon.png',
  theme_path + 'dist/images/fav/favicon-192x192.png', 
  theme_path + 'dist/fonts/colfax-web/ColfaxWebRegular.woff2', 
  theme_path + 'dist/fonts/colfax-web/ColfaxWebBold.woff2', 
  theme_path + 'dist/fonts/colfax-web/ColfaxWebMedium.woff2', 
  theme_path + 'dist/fonts/colfax-web/ColfaxWebBlack.woff2'
];

self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");
  console.log("[PWA Builder] Skip waiting on install");
  
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});
  

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) { 
  
  // if (event.request.method !== "GET" || event.request.url.match(/wp-admin/) || event.request.url.match(/preview=true/)) {
  //  return;
  // }

  // event.respondWith(
  //   fromCache(event.request).then(
  //     function (response) {
  //       // The response was found in the cache so we respond with it and update the entry

  //       // This is where we call the server to get the newest version of the
  //       // file to use the next time we show view
  //       event.waitUntil(
  //         fetch(event.request).then(function (response) {
  //           return updateCache(event.request, response);
  //         })
  //       );

  //       return response;
  //     },
  //     function () {
  //       // The response was not found in the cache so we look for it on the server
  //       return fetch(event.request)
  //         .then(function (response) {
  //           // If request was success, add or update it in the cache
  //           event.waitUntil(updateCache(event.request, response.clone()));

  //           return response;
  //         })
  //         .catch(function (error) {
  //           console.log("[PWA Builder] Network request failed and no cache." + error);
  //         });
  //     }
  //   )
  // );
  
  return;
});

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return
    return caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (matching) {
        if (!matching || matching.status === 404) {
          return Promise.reject("no-match");
        }
  
        return matching;
      });
    });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}

self.addEventListener("activate", function(event) {
    event.waitUntil(
      //Delete old caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (CACHE !== cacheName && cacheName.startsWith("oneorg")) {
              return caches.delete(cacheName);
            }
          })
        );
      }).then(function() {
        console.log('[ServiceWorker] Claiming clients for version - 1728566924714');
        return self.clients.claim();
      })  
    );
});