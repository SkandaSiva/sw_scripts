'use strict';

importScripts('/js/util.js');

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

// Respond to a server push with a user notification
self.addEventListener('push', function (event) {
    if (event.data) {
        const { title, lang = 'fa', body, tag, timestamp, requireInteraction, actions, image, icon, url } = event.data.json();
        const promiseChain = self.registration.showNotification(title, {
            lang,
            body,
            requireInteraction,
            tag: tag || undefined,
            timestamp: timestamp ? Date.parse(timestamp) : undefined,
            actions: actions || undefined,
            image: image || undefined,
            icon: icon,
            data: url,
            dir:'rtl',
        });

        // Ensure the toast notification is displayed before exiting this function
        event.waitUntil(promiseChain);
    }
});

self.addEventListener('notificationclick', function (event) {
    //event.notification.close();
    if (event.notification.data)
        return clients.openWindow('/' + event.notification.data);
    else
        return clients.openWindow('/');
    //console.log(event);

    //event.waitUntil(
    //    clients.matchAll({ type: 'window', includeUncontrolled: true })
    //        .then(function (clientList) {
    //            if (clientList.length > 0) {
    //                console.log(event);
    //                let client = clientList[0];

    //                for (let i = 0; i < clientList.length; i++) {
    //                    if (clientList[i].focused) {
    //                        client = clientList[i];
    //                    }
    //                }

    //                return client.focus();
    //            }

    //            return clients.openWindow('/car');
    //        })
    //);
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
