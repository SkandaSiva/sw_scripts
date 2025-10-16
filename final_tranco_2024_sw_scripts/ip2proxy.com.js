const staticDevIP2Proxy = "dev-ip2proxy-v1.0.1";
const assets = [
  "/",
  // "/assets/css/styles.css",
  "/assets/plugins/font-awesome/css/font-awesome.min.css",
//   "/assets/js/app.js",
  // "/assets/js/scripts.js"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevIP2Proxy).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});