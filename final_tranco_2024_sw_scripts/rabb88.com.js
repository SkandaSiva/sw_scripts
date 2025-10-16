// THIS FILE SHOULD NOT BE VERSION CONTROLLED

// https://github.com/NekR/self-destroying-sw

self.addEventListener('install', function (e) {
  // self.skipWaiting()
  // caches.open('v1').then(function (cache) {
  //   return cache.addAll([
  //     //  These are the files we want to cache so // we can access offline! For your project
  //     // you'll need to add your own. You can
  //     // include any file you wish here.
  //     'index.html'
  //   ])
  // })
})

self.addEventListener('fetch', function (event) {
  // Full documentation for respondWith is available on
  // MDN (http://mzl.la/1SKtV92), but basically with this
  // you are able to customize the response from the
  // request you initially get by the browser.

  // event.respondWith(
  //   caches.open('v1').then(function (cache) {
  //     return cache.match(event.request).then(function (response) {
  //       return response || fetch(event.request).then(function (response) {
  //         cache.put(event.request, response.clone())
  //         return response
  //       })
  //     })
  //   })
  // )
})

self.addEventListener('activate', function (e) {
  // self.registration.unregister()
  //   .then(function () {
  //     return self.clients.matchAll()
  //   })
  //   .then(function (clients) {
  //     clients.forEach(client => client.navigate(client.url))
  //   })
  // e.waitUntil(
  //   caches.keys().then(function (keys) {
  //     return Promise.all(keys
  //       .filter(function (key) {
  //         return key.indexOf('v1') !== 0
  //       })
  //       .map(function (key) {
  //         return caches.delete(key)
  //       })
  //     )
  //   })
  // )
})
