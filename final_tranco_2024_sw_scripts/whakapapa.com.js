/* global self, caches, fetch */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('apps-7.35.32')
      .then(cache => cache.addAll(['/css/7.35.32', '/js/7.35.32'])
        .then(self.skipWaiting())
      )
  )
})

self.addEventListener('activate', e => {
  const cacheWhitelist = ['apps-7.35.32']
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (cacheWhitelist.includes(name)) {
            return caches.delete(name)
          }
          return null
        })
      )
    })
  )
})

self.addEventListener('fetch', e => {
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
    return
  }

  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request)
        .then(response => response || fetch(e.request))
    )
  }
})
