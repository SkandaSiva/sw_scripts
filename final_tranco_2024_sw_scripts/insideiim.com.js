// importScripts('./ngsw-worker.js')
self.importScripts('./ngsw-worker.js')

self.addEventListener('fetch', (event) => {
  if (
    event &&
    event.request &&
    event.request.url &&
    event.request.url.includes('/amp/')
  ) {
    event.stopImmediatePropagation()
  }
})

// self.addEventListener('notificationclick', (event) => {
//   console.log('[Service Worker] Notification click Received. event', event)
//   event.notification.close()
//   if (clients.openWindow && event.notification.data.url) {
//     event.waitUntil(clients.openWindow(event.notification.data.url))
//   }
// })
