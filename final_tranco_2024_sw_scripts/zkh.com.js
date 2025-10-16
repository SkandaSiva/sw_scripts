var cacheStorageKey = 'pwa-20240528'
var cacheList = []
self.addEventListener('install', e => {
  // e.waitUntil(
  //   caches.open(cacheStorageKey)
  //     .then(
  //       // 缓存基本资源
  //       cache => cache.addAll(cacheList)
  //     )
  //     .then(() => self.skipWaiting())
  // )
})
self.addEventListener('fetch', function(e) {
  // var url = e.request.url
  // if(url.indexOf('manifest.json') === -1) {
  //   return
  // }
  // e.respondWith(
  //   caches.match(e.request).then(function(response) {
  //     if (response != null) {
  //       return response
  //     }
  //     return fetch(e.request.url)
  //     // console.log('fetch', e.request.url)
  //   })
  // )
})
self.addEventListener('activate', e => {
  // e.waitUntil(
  //   caches.keys().then(cacheNames => {
  //     return Promise.all(
  //       cacheNames.map(cacheName => {
  //         if (cacheName !== cacheStorageKey) {
  //           return caches.delete(cacheName)
  //         }
  //       })
  //     )
  //   })
  // )
})