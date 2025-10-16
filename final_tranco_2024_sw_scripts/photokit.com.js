var cacheStorageKey = 'minimal-pwa-1'

var cacheList = [


    "/editor/assets/lib/layer.js"
]


self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})

self.addEventListener('fetch', function(e) {
  
})