let OFFLINE_URL = "/offline"; // Match your offline page URL
let PRE_CACHE = "pre-cache--v8000.629c4d286280c86cd1797260dca82065"; // Manually update version or generate one server-site
let PRE_CACHE_URL = "/pwa-cache"; // Match your pre-cache URL
let RUNTIME_CACHE = "runtime-cache";
let EXCLUDE_CACHE = ["/admin/", "https://securestream.o94.at/live.mp3"];

/** Install : Service Worker */
self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log(
    "[ServiceWorker] Install with pre-cache at '" + PRE_CACHE_URL + "'"
  );
  console.log("[ServiceWorker] Offline URL set to '" + OFFLINE_URL + "'");

  event.waitUntil(
    fetch(PRE_CACHE_URL)
      .then((response) => response.json())
      .then((precache_files) => {
        caches.open(PRE_CACHE).then((cache) => {
          if (OFFLINE_URL) {
            console.log(
              "[ServiceWorker] Using offline URL '" + OFFLINE_URL + "'"
            );
            precache_files.push(OFFLINE_URL);
          } else {
            console.log("[ServiceWorker] No offline URL passed.");
          }
          console.log(
            "[ServiceWorker] Pre-caching offline files",
            precache_files
          );
          return cache.addAll(precache_files);
        });
      })
  );

  // self.skipWaiting();
});

/** Activate : Service Worker */
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");

  // Invalidate any existing old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== PRE_CACHE) {
            console.log("[ServiceWorker] Removing stale cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  // Become the controller for all the clients
  self.clients.claim();
});

/** Fetch : Service Worker */
self.addEventListener("fetch", (event) => {
  //console.log("[ServiceWorker] Fetch", event.request.url);

  for (let i = 0; i < EXCLUDE_CACHE.length; i++) {
    if (event.request.url.indexOf(EXCLUDE_CACHE[i]) !== -1) {
      // console.log('URL excluded from cache:', event.request.url)
      return false;
    }
  }

  // URLs requested by the user.
  // Cache Strategy: Network-first, auto-add to runtime cache, fallback to pre-cache, fallback to offline page
  // Skip chrome extensions
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            if (
              event.request.method == "GET" &&
              !event.request.url.startsWith("chrome-extension")
            )
              cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch((error) => {
          return caches
            .match(event.request, { ignoreSearch: true })
            .then((response) => {
              if (response) {
                console.log(
                  "[ServiceWorker] Found navigate request in cache",
                  event.request.url
                );
                return response;
              } else {
                if (!OFFLINE_URL)
                  return new Response("Network error happened", {
                    status: 408,
                    headers: { "Content-Type": "text/plain" },
                  });
                return caches.match(OFFLINE_URL).then((response) => {
                  console.log(
                    "[ServiceWorker] Found offline URL in cache",
                    event.request.url
                  );
                  return response;
                });
              }
            });
        })
    );
  }

  // URLs requested by page contents or API requests
  // Cache Strategy: Network-first, auto-add to runtime cache, fallback to pre-cache
  // Skip chrome extensions
  else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(RUNTIME_CACHE).then((cache) => {
            if (
              event.request.method == "GET" &&
              !event.request.url.startsWith("chrome-extension")
            )
              cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch((error) => {
          console.log(
            "[ServiceWorker] Found request in cache",
            event.request.url
          );
          return caches.match(event.request);
        })
    );
  }
});
