let notificationUrl = null;

self.addEventListener('push', function (event) {
    event.waitUntil(handlePushEvent(event));
});

async function handlePushEvent(event) {
    try {

        const response = event.data.json();

        if (!response) {
            return;
        }

            let notificationDetails = {
                actions:[{action: "view", title: 'View'}],
                body: response.body,
            }
            if(response.image) {
                notificationDetails.icon = response.image;
            }
            if(response.link) {
                notificationUrl = response.link;
            } else {
                notificationUrl = 'notifications';
            }
            self.registration.showNotification(response.title, notificationDetails);

    } catch (error) {
        console.log('Error fetching notifications:', error);
    }
}

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: 'window' }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow(notificationUrl);
    }
    ));
});