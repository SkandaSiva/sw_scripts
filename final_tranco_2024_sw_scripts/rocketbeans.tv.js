importScripts('./ngsw-worker.js');

(function () {
    'use strict';

    self.addEventListener('notificationclick', (event) => {
        let url = event.notification.data.url;
        event.notification.close(); // Android needs explicit close.
        event.waitUntil(
            clients.matchAll().then( windowClients => {
                for (let client of windowClients) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(url);
            })
        );
    });
}());