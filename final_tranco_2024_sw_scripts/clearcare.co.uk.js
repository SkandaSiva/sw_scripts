self.addEventListener('push', (event) => {
  const data = event.data.json()

  const pushPromise = isClientFocused().then(async (value) => {
    if (value) {
      await clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then((windowClients) => {
          windowClients.forEach((windowClient) => {
            windowClient.postMessage({
              notification: data,
            })
          })
        })
    } else {
      await self.registration.showNotification(data.title, {
        body: data.body.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&'),
      })
    }
  })

  event.waitUntil(Promise.all([pushPromise]))
})

const isClientFocused = () => {
  return clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let clientIsFocused = false
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i]
        if (windowClient.focused) {
          clientIsFocused = true
          break
        }
      }

      return clientIsFocused
    })
}
