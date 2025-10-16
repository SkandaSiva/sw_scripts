
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    // console.log('Activated', event);
});

self.addEventListener('push', function (event) {
    console.log('Push message', event);

    var dataText = event.data;
    // console.log('Push data: ' + dataText.text());

    const data = event.data.json();
    const title = data.title || 'Новина';
    return self.registration.showNotification(title, {
        body: data.message,
        icon: data.icon,
        link: data.link,
        ttl: data.ttl,
        tag: data.link
    });

});


self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.tag);
                }
            })
    );
});
