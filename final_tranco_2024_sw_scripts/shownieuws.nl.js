const CACHE_NAME = "offline-cache-v1";
const urlsToCache = [];

// Install event - Initial caching of selected urls
self.addEventListener("install", (event) => {
  event.waitUntil(
    // caches
    //   .open(CACHE_NAME)
    //   .then((cache) => {
    //     return cache.addAll(urlsToCache);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to cache during install", error);
    //   })
    Promise.resolve()
  );
});

// Fetch event - Caching logic for network requests
self.addEventListener("fetch", (event) => {
  // let it pass through unhandled for now
  return;
  // event.respondWith(
  //   fetch(event.request)
  //     .catch(() => {
  //       return caches.match(event.request);
  //     })
  // );
});

// Activate event - Cleans up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .catch((error) => {
        console.error("Failed to clean up old caches", error);
      })
  );
});
