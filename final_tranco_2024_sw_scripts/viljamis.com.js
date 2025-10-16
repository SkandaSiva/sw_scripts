addEventListener("install", event => {
  event.waitUntil(
    caches.open("ariel").then(function (cache) {
      return cache.addAll([
        "/offline/",
        "/fonts/g.woff",
        "/fonts/g-italic.woff",
        "/fonts/nouvelle-fat.woff2",
        "/fonts/nouvelle-light.woff2"
      ]);
    })
  );
});

addEventListener("fetch", event => {
  const request = event.request;

  // Ignore non-GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    (async function () {
      // Try the cache
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        return await fetch(event.request);
      } catch (err) {
        return caches.match("/offline/");
      }
    })()
  );
});
