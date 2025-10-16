const CACHE_VERSION = 2;

const CURRENT_CACHES = {
  js: `js-cache-v${CACHE_VERSION}`,
};

self.addEventListener("activate", function (event) {
  const expectedCacheNames = Object.values(CURRENT_CACHES);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNames.includes(cacheName)) {
            console.log("Deleting out of date cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(CURRENT_CACHES.js).then((cache) => {
      return cache
        .match(event.request)
        .then((response) => {
          if (response) return response;

          return fetch(event.request.clone()).then((response) => {
            const url = new URL(event.request.url);

            if (url.origin !== location.origin) {
              return response;
            }

            if (!url.pathname.startsWith("/assets")) return response;

            if (
              response.status < 400 &&
              response.headers.get("Content-Type") === "application/javascript"
            ) {
              cache.put(event.request, response.clone());
            }

            return response;
          });
        })
        .catch((error) => {
          console.error("Error in fetch handler:", error);

          throw error;
        });
    }),
  );
});
