const skinCache = "skin-static";
let regex = /(js|css|svg|webp|png|jp(e*)g|woff2|)/;
let assets = [];

// Install SW
self.addEventListener("install", (evt) => {
  //console.log("SW is installed");
  evt.waitUntil(
    caches.open(skinCache).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// Listen to Activate SW
self.addEventListener("activate", (evt) => {
  //console.log("SW is activated");
});

// Fetch events
self.addEventListener("fetch", (evt) => {
  evt.request.url.match(regex) && assets.push(evt.request.url);
  assets = [...new Set(assets)];
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return cacheRes || fetch(evt.request);
    })
  );
});
