const staticDevIP2WHOIS = "dev-ip2whois-v1.0.1";
const assets = [
  "/",
  "/assets/css/style.min.css",
  "/assets/css/header-default.css",
  "/assets/css/footer-v1.css",
  "/assets/css/app.min.css",
  "/assets/css/ie8.css",
  "/assets/css/blocks.css",
  "/assets/css/plugins.css",
  "/assets/js/jquery.numeric.min.js"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevIP2WHOIS).then(cache => {
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