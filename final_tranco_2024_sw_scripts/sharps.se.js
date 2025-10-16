'use strict';

self.addEventListener('push', function(e) {
    var payload = e.data.json();

    e.waitUntil(self.registration.showNotification(payload.title, {
        body: payload.body,
        icon: '/forums/favicon.ico',
        badge: '/forums/favicon.ico',
        tag: payload.tag,
        data: payload
    }));
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    e.waitUntil(self.clients.openWindow(e.notification.data.url));
});

self.addEventListener('pushsubscriptionchange', function(e) {
    if (e.newSubscription)
        e.waitUntil(fetch('/push/subscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(e.newSubscription)
        }));
});
