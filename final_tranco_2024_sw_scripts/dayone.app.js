const CACHE_VERSION = "v2";

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => key !== CACHE_VERSION);
  await Promise.all(cachesToDelete.map(deleteCache));
};

const putInCache = async (request, response) => {
  if (shouldCache(request.url)) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response);
  }
};

const shouldCache = (url) => {
  // You'd think we would cache the avatar and post media requests here,
  // but the server returns pre-signed AWS URLs that last for a limited
  // time when we request those. So we can't cache them.
  return (
    url.includes("/focusModeImages") || url.includes("/trpc/getCustomEmbedInfo")
  );
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    // We must always return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(Promise.all([enableNavigationPreload(), deleteOldCaches()]));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
    }),
  );
});

self.addEventListener("message", async (event) => {
  switch (event.data?.type) {
    case "CLEAR_CACHE":
      await caches.delete(CACHE_VERSION);
      break;

    case "UPDATE":
      self.skipWaiting();
      break;
  }
});
// Cache busting:  n3HXjHrq3cbWcRAz
