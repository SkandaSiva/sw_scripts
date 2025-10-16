var offlinePage = new Request('offline.html')

self.addEventListener('install', function (event) {
  event.waitUntil(
    fetch(offlinePage).then(function (response) {
      return caches.open('offline').then(function (cache) {
        return cache.put(offlinePage, response)
      })
    }))
})
self.addEventListener('fetch', function (event) {
  var request = event.request
  if (request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(function (error) {
        return caches.open('offline').then(function (cache) {
          return cache.match('offline.html')
        })
      }
      ))
  }
})

self.addEventListener('refreshOffline', function (response) {
  return caches.open('offline').then(function (cache) {
    console.log('Offline page updated from refreshOffline event: ' + response.url)
    return cache.put(offlinePage, response)
  })
})
