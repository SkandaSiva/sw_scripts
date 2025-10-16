// Purpose of this service worker:
// THIS IS MAINLY TO CACHE STATIC ASSETS. Do not use this for API requests!
//
// Service workers are the only way to get a page to load while offline, so
// we need to cache only assets required to load the page.

const CACHE_NAME = "blitz-sw-cache";
const ASSET_EXT_REGEXP = /\.(m?js|map)$/;
const APP_ROUTE_REGEXP = /^\/(?:app\/|v(?=\d))([^/]*)(.*)/;
const LOCAL_REGEXP = /^https?:\/\/(localhost|127\.0\.0\.1)/;
const SELF_REGEXP = /^https?:\/\/(.*?\.)?(blitz\.gg|localhost)/;
const IMMUTABLE_ASSET_REGEXP =
  /(?:[^/]+-[a-z0-9]+\.js(?:\.map)?|(?:v|app\/)[0-9.]+\/?)$/i;
const ENTRY_POINTS = [];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const {
        registration: { scope },
      } = self;

      const isApp = APP_ROUTE_REGEXP.test(scope);
      if (isApp) ENTRY_POINTS.push(scope);

      const {
        target: {
          serviceWorker: { scriptURL },
        },
      } = event;
      if (LOCAL_REGEXP.test(scriptURL)) return;
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ENTRY_POINTS);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME];

  // why claim: https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            return !cacheAllowlist.includes(cacheName)
              ? caches.delete(cacheName)
              : null;
          }),
        );
      })(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  // Bypass service worker entirely for local requests (for game integrations).
  if (LOCAL_REGEXP.test(event.request.url)) return;

  // Also bypass for domains we don't own or API domains.
  if (!SELF_REGEXP.test(event.request.url)) return;

  // ===========================================================================
  // THE FOLLOWING IS POTENTIALLY DANGEROUS AND CAN RESULT IN NO NEW RESPONSES
  // PROCEED WITH CAUTION!
  event.respondWith(
    (async () => {
      const urlObj = new URL(event.request.url);
      const isAsset = ASSET_EXT_REGEXP.test(urlObj.pathname);
      const appVersion = urlObj.pathname.match(APP_ROUTE_REGEXP)?.[1];

      // For the app, all sub-routes just return index.html.
      const isAppIndex = !isAsset && appVersion;
      const cacheKey = isAppIndex ? appVersion : event.request.url;

      // Check cache first.
      const cachedResponse = await caches.match(cacheKey);

      // Determine if we should just return the cached response if we
      // consider the response to be immutable.
      const isImmutable = IMMUTABLE_ASSET_REGEXP.test(event.request.url);
      if ((isImmutable || isAppIndex) && cachedResponse) return cachedResponse;

      const networkPromise = fetch(event.request, {
        ...event.request,
        mode: "cors",
        credentials: "omit",
      });

      // Side effect to cache response.
      if (isImmutable) {
        networkPromise.then((initialResponse) => {
          if (!initialResponse.ok) return;
          const responseToCache = initialResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(cacheKey, responseToCache);
          });
        });
      }

      return networkPromise;
    })(),
  );
  // ===========================================================================
});
