const staticCacheName = "iranjib-v4";
const cacheAssets = [
  "/images/iranjib-logo.webp",
  "/fonts/IRANSans/woff2/IRANSansWeb.woff2",
  "/js/jquery-3.6.0.min.js",
  "/js/all.20200816.v2.min.js",
  "/js/footer.20200816.v1.min.js",
  "/js/blazy.min.js"
];


self.addEventListener("install", evt => {
  evt.waitUntil(
    caches
      .open(staticCacheName)
      .then(cache => {
        console.log("caching assets...");
        cache.addAll(cacheAssets);
      })
      .catch(err => {})
  );
});

self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then(res => {
        return res || fetch(evt.request);
      })
      .catch(err => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("./pages/fallback.html");
        }
      })
  );
});
