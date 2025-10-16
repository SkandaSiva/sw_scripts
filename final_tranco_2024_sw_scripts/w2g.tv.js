self.addEventListener('push', function (event) {
    var data = event.data.json();
    event.waitUntil(self.registration.showNotification(data.title, {
        body: data.body,
        data: data.url,
        icon: data.icon,
        requireInteraction: true,
        tag: "tag"
    }));
});

self.addEventListener('notificationclick', function (event) {
    if (clients.openWindow) {
        event.notification.close();
        return clients.openWindow(event.notification.data);
    }
});