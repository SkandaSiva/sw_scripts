self.addEventListener('push', async ({ data }) => {
    const dataObject = JSON.parse(data.text())
    const { title, body, link, icon, image } = dataObject

    self?.registration?.showNotification(title, {
        body,
        data: link,
        icon,
        image,
    })
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(clients.openWindow(event.notification.data))
})
