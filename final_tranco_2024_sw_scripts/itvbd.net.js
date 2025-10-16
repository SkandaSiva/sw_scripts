const jwsw = "itv-app";
const assets = [
  //"https://www.itvbd.com/",
  "https://www.itvbd.com/contents/themes/public/style/final.css",
  //"app.js",
  "https://www.itvbd.com/contents/themes/public/style/images/logo-300x300.png",
  "https://www.itvbd.com/contents/themes/public/style/images/logo-512x512.png",
  "https://www.itvbd.com/contents/themes/public/style/images/logo.svg",
]

//install app

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(jwsw).then(cache => {
      cache.addAll(assets)
    })
  )
});

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
*/
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  });
