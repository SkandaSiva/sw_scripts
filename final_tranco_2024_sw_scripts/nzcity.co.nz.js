'use strict';

self.importScripts('/js/push.js');

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});


self.addEventListener('push', function (event) {
    var payload = event.data ? event.data.json() : null;

    if (payload !== null) {

        var options = {};
        if (payload.body) { options.body = payload.body; }
        if (payload.icon) { options.icon = payload.icon; }
        if (payload.image) { options.image = payload.image; }
        if (payload.badge) { options.badge = payload.badge; }
        if (payload.tag) { options.tag = payload.tag; }
        if (payload.data) { options.data = payload.data; }

        event.waitUntil(
            self.registration.showNotification(payload.title, options)
        );

    }

});

self.addEventListener('pushsubscriptionchange', function (event) {
    event.waitUntil(
        Promise.all([
            Promise.resolve(event.oldSubscription ? deleteSubscription(event.oldSubscription) : true),
            Promise.resolve(event.newSubscription ? event.newSubscription : subscribePush(registration))
                .then(function (sub) { return saveSubscription(sub); })
        ])
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var data = event.notification.data;

    if (data && data.url && data.url !== '') {
        var urlToOpen = new URL(data.url, self.location.origin).href;

        event.waitUntil(clients.matchAll({
            type: 'window', includeUncontrolled: true
        }).then(function (clientList) {
            for (let i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }

        }));

    }

});
