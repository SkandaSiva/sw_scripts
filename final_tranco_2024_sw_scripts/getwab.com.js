// Listen for push events
self.addEventListener('push', function(event) {

    const message = JSON.parse(event.data.text());

    const options = {
        body: message.body,
        icon: message.icon,
        badge: message.badge,
        actions: message.actions
    };

    event.waitUntil(
        self.registration.showNotification(message.title, options)
    );
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {

    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Handle installation
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

// Handle activation
self.addEventListener('activate', function(event) {
    event.waitUntil(
        clients.claim()
    );
});
