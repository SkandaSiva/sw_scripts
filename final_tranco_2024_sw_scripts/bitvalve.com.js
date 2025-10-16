importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
  );
  
  if (workbox) {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
    workbox.loadModule("workbox-recipes");
  }
  
  const {
    imageCache,
    googleFontsCache,
    pageCache,
    staticResourceCache,
    warmStrategyCache,
  } = workbox.recipes;
  
  const { registerRoute, setDefaultHandler } = workbox.routing;
  const { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } =
    workbox.strategies;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;
  
  setDefaultHandler(new NetworkOnly());
  
  // Cache script resources using CacheFirst strategy
  imageCache();
  googleFontsCache();
  pageCache();
  
  self.addEventListener("install", async (event) => {
    console.log("Service worker installed again!@");
  });
  
  registerRoute(
    ({ request }) => request.destination === "script",
    new StaleWhileRevalidate({
      cacheName: "script-cache",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  registerRoute(
    ({ request }) => request.destination === "font",
    new CacheFirst({
      cacheName: "font-cache",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  registerRoute(
    ({ request }) => request.url.includes("/api/"),
    new NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );
  
  self.addEventListener("fetch", async (event) => {
    // Prevent the default fetch behavior for non-GET requests
    if (event.request.method !== "GET") {
      return;
    }
  
    if (event.request.url.includes("api")) {
      // Clone the request to avoid interfering with the original fetch
      const clonedRequest = event.request.clone();
      // Attempt to fetch the resource
      event.respondWith(
        fetch(clonedRequest).catch(async () => {
          // If the fetch fails (offline), use the cache for GET requests
          if (clonedRequest.method === "GET") {
            return await caches.match(clonedRequest.url, {
              cacheName: "api-cache",
            });
          }
          throw new Error("Request failed and not a GET request.");
        })
      );
    }
  });
  