const CACHE_NAME = "reels";
const MAX_AGE = 60 * 60 * 24; // 1 day in seconds
const MAX_ENTRIES = 100; // Maximum number of entries to keep in the cache

const urlsToCache = [
  "/edge/openai-voice",
  "/edge/polly-voice",
  "/edge/neets-voice",
  "/integrations/tiktok/creator-info",
  "/integrations/youtube/creator-info",
  "/creative-devi/news-image",
];

async function generateCacheKey(request) {
  const url = request.url;
  const requestBody = await request.text();
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(url + requestBody)
  );
  return (
    url +
    "-" +
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

async function cleanupOldCaches() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();

    for (const request of keys) {
      const response = await cache.match(request);
      const cacheTime = response.headers.get("x-cache-time");

      if (cacheTime && now - parseInt(cacheTime) > MAX_AGE * 1000) {
        await cache.delete(request);
      }
    }

    if (keys.length > MAX_ENTRIES) {
      const entriesToDelete = keys.length - MAX_ENTRIES;
      for (let i = 0; i < entriesToDelete; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await cleanupOldCaches();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const constructedPathName = new URL(url).pathname;

  if (urlsToCache.find((u) => constructedPathName.endsWith(u))) {
    event.respondWith(
      (async () => {
        try {
          const clone = event.request.clone();

          const cacheKey = await generateCacheKey(clone);
          const cachedResponse = await caches.match(cacheKey);

          if (cachedResponse) {
            return cachedResponse;
          }

          const response = await fetch(event.request);

          if (response.type === "opaque") {
            console.log("Opaque response received, skipping cache");
            return response;
          }

          if (response.ok) {
            const responseToCache = response.clone();

            const newHeaders = new Headers(responseToCache.headers);
            newHeaders.set("Cache-Control", `max-age=${MAX_AGE}`);
            newHeaders.set("x-cache-time", Date.now().toString());

            const cachedResponse = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: newHeaders,
            });

            const cache = await caches.open(CACHE_NAME);
            await cache.put(cacheKey, cachedResponse);
            await cleanupOldCaches();
          }

          return response;
        } catch (error) {
          console.error("Fetch failed:", error);
          return new Response("An error occurred", { status: 500 });
        }
      })()
    );
  }
});
