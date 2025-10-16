/* LoyJoy Service Worker */
"use strict";

self.addEventListener('push', function(event) {
    const payload = JSON.parse(event.data.text());

    event.waitUntil(self.registration.showNotification(payload.title, payload.options));

    self.addEventListener('notificationclick', function(event) {
        event.notification.close();
        event.waitUntil(
            clients.openWindow(payload.url)
        );
    });
});
