self.addEventListener('install', (event) => {
  event.waitUntil(
    self.skipWaiting()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim()
  )
})

self.addEventListener('fetch', (event) => {
})

self.addEventListener('push', (event) => {
})

self.addEventListener('notificationclick', event => {
})

self.addEventListener('pushsubscriptionchange', async (event) => {
})
