const CACHE = "pwabuilder-page";
const offlineFallbackPage = "index.html";
self.addEventListener("install", function (event) {
  caches.open(CACHE).then(function (cache) {
    if (offlineFallbackPage === "offline") {
      return cache.add(new Response("TODO"));
    }
    return cache.add(offlineFallbackPage);
  })
});
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(function (error) {
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return;
      }
      console.error("Network request Failed." + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});
self.addEventListener("refreshOffline", function (event) {
  const offlineFallbackPage = new Request(offlineFallbackPage);
  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("PWA Builder" + response.url);
      return cache.put(offlineFallbackPage, response);
    });
  });
});