const staticCacheName = "trippyadiveCache";
const assets = [
  "/app.js",
  "/search.php"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching cell assets");
      cache.addAll(assets);
    })
  );
});

//activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
});

//fetch event
self.addEventListener("fetch", (evt) => {
  console.log("fetch Event", evt);
});
