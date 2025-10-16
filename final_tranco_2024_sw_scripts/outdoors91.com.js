self.addEventListener("push", (event) => {
    const notification = event.data.json();
    // console.log("notification : ", notification );
    event.waitUntil(self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        image: notification.image,
        data: {
            notifURL: notification.url
        }
    }));
});
self.addEventListener("notificationclick", (event) => {
    event.waitUntil(clients.openWindow(event.notification.data.notifURL));
});
