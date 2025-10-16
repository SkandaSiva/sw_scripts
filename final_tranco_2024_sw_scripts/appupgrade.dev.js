/* eslint-disable */
const appUpgradeCache = "appupgrade-v3"
const assets = [
  "./"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(appUpgradeCache).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', function (event) {
  // it can be empty if you just want to get rid of that error
});