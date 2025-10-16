importScripts('/Site/js/PushNotification/util.js');

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

// Respond to a server push with a user notification
self.addEventListener('push', function (event) {

    if (event.data) {
        const { title, lang, body, tag, timestamp, requireInteraction, actions, image, icon, badge, data } = event.data.json();
        const promiseChain = self.registration.showNotification(title, {
            lang,
            body,
            requireInteraction,
            tag: tag || undefined,
            timestamp: timestamp ? Date.parse(timestamp) : undefined,
            actions: actions || undefined,
            image: image || undefined,
            badge: badge,
            icon: icon,
            vibrate: [100, 50, 100],
            data
        });

        // Ensure the toast notification is displayed before exiting this function
        event.waitUntil(promiseChain);
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    OnclickNotification(event, this);
    //    event.waitUntil(
    //        clients.matchAll({ type: 'window', includeUncontrolled: true })
    //            .then(function (clientList) {
    //                if (clientList.length > 0) {
    //                    let client = clientList[0];
    //
    //                    for (let i = 0; i < clientList.length; i++) {
    //                        if (clientList[i].focused) {
    //                            client = clientList[i];
    //                        }
    //                    }
    //                    if (event.action.includes("OpenLink")) {
    //                        return clients.openWindow(event.action.replace("OpenLink_"));
    //                    } else {
    //                         return client.focus();
    //                    }
    //                   
    //                }
    //                if (event.action.includes("OpenLink")) {
    //                    return clients.openWindow(event.action.replace("OpenLink_"));
    //                } else {
    //                    return clients.openWindow('/');
    //                }
    //
    //            })
    //    );
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
