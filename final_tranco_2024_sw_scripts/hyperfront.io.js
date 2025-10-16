// revision 1732637465836

var cacheName = "hyperfront-sw-cache"

var urlsToCache = [
  "static/css/170.585a9519.chunk.css",
  "static/css/main.e8b9209d.chunk.css",
  "static/js/precache.fa06c17b.chunk.js"
]

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") skipWaiting()
})

self.addEventListener("install", function (event) {
  event.waitUntil(
    Promise.all([
      caches.open(cacheName).then(function (cache) {
        return cache.addAll(urlsToCache)
      }),
      skipWaiting(),
    ]),
  )
})

self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName)
          }),
        )
      }),
      clients.claim(),
    ]),
  )
})

function networkFirst(event) {
  var networkPromise = new Promise(function (resolve) {
    fetch(event.request)
      .then(function (networkResponse) {
        // response needs to be cloned before use if it is going to be used more than once
        var clonedResponse = networkResponse.clone()
        if (event.request.method !== "POST" && event.request.method !== "PATCH") {
          caches.open(cacheName).then(function (runtimeCache) {
            runtimeCache.put(event.request, networkResponse)
          })
        }
        resolve(clonedResponse)
      })
      .catch(function () {
        caches.open(cacheName).then(function (runtimeCache) {
          runtimeCache.match(event.request).then(function (cachedResponse) {
            resolve(cachedResponse)
          })
        })
      })
  })

  event.respondWith(networkPromise)
  event.waitUntil(networkPromise)
}

function cacheFirst(event) {
  var cachePromise = new Promise(function (resolve) {
    caches.open(cacheName).then(function (runtimeCache) {
      runtimeCache.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) return resolve(cachedResponse)

        fetch(event.request).then(function (networkResponse) {
          // response needs to be cloned before use if it is going to be used more than once
          var clonedResponse = networkResponse.clone()
          caches.open(cacheName).then(function (runtimeCache) {
            runtimeCache.put(event.request, networkResponse)
          })
          resolve(clonedResponse)
        })
      })
    })
  })

  event.respondWith(cachePromise)
  event.waitUntil(cachePromise)
}

self.addEventListener("fetch", function (event) {
  var url = event.request.url

  if (
    url.match(/^https?:\/\/.+\/api\/(script|person|financing|billing|scoring)/) ||
    url.match(/^https?:\/\/.+\/api\/core\/(tasks|taxes|indexes|tenants|users)/)
  ) {
    networkFirst(event)
    return
  }

  if (url.indexOf(self.location.hostname) === -1 || url.match(/^https?:\/\/.+\/api\//) || url.match(/^https?:\/\/.+\/version\.txt/)) {
    // network-only, no handler needed
    return
  }

  cacheFirst(event)
})

var notificationUrl = ""
self.addEventListener("push", function (event) {
  console.log("Push received: ", event)
  var eventDataText = event.data ? JSON.parse(event.data.text()) : {}
  notificationUrl = eventDataText.url
  event.waitUntil(
    self.registration.showNotification(eventDataText.title, {
      body: eventDataText.message,
      icon: eventDataText.icon,
      tag: eventDataText.tag,
    }),
  )
})

// notification url redirect event click
self.addEventListener("notificationclick", function (event) {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function () {
      if (clients.openWindow) return clients.openWindow(notificationUrl)
    }),
  )
})
