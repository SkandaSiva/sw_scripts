const CACHE_NAME = "my-app-cache-v1730889294967";
// Cache duration.
const CACHE_TIMEOUT = Infinity;
// Maximum number of images to cache.
const MAX_CACHE_ITEMS = 500;
const FONT_URLS = [
  "https://media.umangapp.in/cdn/landing/fonts/poppins-bold-webfont.woff2",
  "https://media.umangapp.in/cdn/landing/fonts/poppins-light-webfont.woff2",
  "https://media.umangapp.in/cdn/landing/fonts/poppins-medium-webfont.woff2",
  "https://media.umangapp.in/cdn/landing/fonts/poppins-regular-webfont.woff2",
  "https://media.umangapp.in/cdn/landing/fonts/poppins-semibold-webfont.woff2",
];

// Install event - caching static assets
self.addEventListener("install", (event) => {
  // Activate worker immediately.
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(FONT_URLS);
    })
  );
});

// Activate event - cache invalidation
self.addEventListener("activate", (event) => {
  // Clean up old caches if necessary.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName.startsWith("my-app-cache-") &&
            cacheName !== CACHE_NAME
          ) {
            return caches
              .delete(cacheName)
              .then(() => {
                return self.clients.claim(); // Claim clients immediately
              })
              .then(() => {
                // Inform clients to reload
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) =>
                    client.postMessage({ action: "reload" })
                  );
                });
              });
          }
        })
      );
    })
  );
});

// Fetch event - serving cached content
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url).toString();

  // Check if the request URL is in the FONT_URLS array
  if (FONT_URLS.includes(requestUrl)) {
    event.respondWith(
      caches.match(requestUrl).then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Cache miss - fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone the response
          const responseToCache = networkResponse.clone();

          // Cache the new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            // Clean up old items if necessary.
            cleanOldCache(cache);
          });

          return networkResponse;
        });
      })
    );
  }
  // Caching build and styling files.
  else if (
    requestUrl.includes("/landing/") &&
    (/\.js($|\?)/.test(requestUrl) || /\.css($|\?)/.test(requestUrl))
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const currentTS = new Date().getTime();
          const respTimeout = +cachedResponse?.headers.get("x-timeout-value");

          if (!cachedResponse || currentTS >= respTimeout) {
            return fetch(event.request).then((networkResponse) => {
              // If response has 20X or 30X status code.
              if (networkResponse.ok) {
                const clonedHeaders = new Headers();

                // Cloning response headers.
                for (let [key, value] of networkResponse.headers.entries()) {
                  clonedHeaders.set(key, value);
                }

                // Setting cache timeout header.
                clonedHeaders.set(
                  "x-timeout-value",
                  new Date().getTime() + CACHE_TIMEOUT
                );

                const clonedResponse = new Response(
                  networkResponse.clone().body,
                  {
                    status: networkResponse.status,
                    statusText: networkResponse.statusText,
                    headers: clonedHeaders,
                  }
                );

                cache.put(event.request, clonedResponse);
                // Clean up old items if necessary.
                cleanOldCache(cache);
              }

              return networkResponse;
            });
          }

          return cachedResponse;
        });
      })
    );
  }
});

function cleanOldCache(cache) {
  cache.keys().then((keys) => {
    if (keys.length > MAX_CACHE_ITEMS) {
      // Remove oldest cache item if limit exceeded
      cache.delete(keys[0]);
    }
  });
}
