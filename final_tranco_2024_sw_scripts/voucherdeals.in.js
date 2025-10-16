/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: data.icon,
    tag: data.tag,
    data: {
      url: data.url,
    },
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(event.notification.data.url))
})
