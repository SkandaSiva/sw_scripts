// sw.js
const CACHE_VERSION = 1;
const CACHE_NAME = `gtm-gtag-cache-v${CACHE_VERSION}`;

const urlsToCache = [
  "/",
  "/index.html",
  "/src/styles/tailwind.css",
  "https://www.googletagmanager.com/gtm.js?id=GTM-NPS952B",
  "https://www.googletagmanager.com/gtag/js?id=G-06GNMRQG81",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache what we can, ignore failures
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache
            .add(url)
            .catch((err) => console.warn(`Failed to cache ${url}:`, err))
        )
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a success response
          if (!response || response.status !== 200) {
            return response;
          }
          // Clone the response before caching
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((err) => console.warn("Failed to cache:", err));
          return response;
        })
        .catch((error) => {
          console.warn("Fetch failed:", error);
          throw error;
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
