self.addEventListener('push', function(event) {
    notificationData = event.data.json();
    event.waitUntil(
        self.registration.showNotification(notificationData.notification.title, {
            body: notificationData.notification.body,
            icon: notificationData.notification.icon
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    var url = event.target.notificationData.notification.click_action;
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll().then(function(clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return self.clients.openWindow(url);
        })
    );
});

