self.addEventListener("install", (event) => {
  self.skipWaiting()
})
self.addEventListener("activate", (event) => {
  self.skipWaiting()
})

self.addEventListener("push", function (event) {
  const data = event.data.json()

  event.waitUntil(
    registration.showNotification(data.titulo, {
      body: data.cuerpo,
      icon: data.data.pictureUrl,
      vibrate: [
        125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600,
      ],
      openUrl: "/",
      data: data.data,
      actions: data.actions,
    })
  )
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  const notificacion = event.notification
  const accion = event.action

  if (accion === "go-to-appointment") {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          if (clientList.length > 0) {
            let client = clientList[0]
            for (let i = 0; i < clientList.length; i++) {
              if (clientList[i].focused) {
                client = clientList[i]
              }
            }
            return client.redirectTo(notificacion.data.redirectTo)
          }
          return clients.openWindow("/")
        })
    )
    return
  }
})
