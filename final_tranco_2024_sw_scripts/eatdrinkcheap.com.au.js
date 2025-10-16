const staticEDC = "eatdrinkcheap"
const assets = [
  "/",
  "/css/main.css",
  "/images/eat-drink-cheap-logo.png",
  "/images/eat-drink-cheap-logo-reverse.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticEDC).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})


if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .catch(err => console.log("service worker not registered", err))
  })
}