self.addEventListener('push', function (event) {
    let notificationData = {};

    try {
        notificationData = event.data.json();
    } catch (e) {
        notificationData = {
            title: 'Default title',
            body: 'Default message',
            icon: '/default-icon.png',
            url: '/'
        };
    }
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            data: {
                url: notificationData.url
            }
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    let data = event.notification.data;
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll().then(function (clientList) {

            if (clientList.length > 0) {
                return clientList[0].focus();
            }

            return self.clients.openWindow(data.url);
        })
    );
});