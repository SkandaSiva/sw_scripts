const staticSite = "dev-site-v1";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/register.gif",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticSite).then(cache => {
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