'use strict';

var subscriptionId = null;

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('push', function(event) {
    onPush(event);
}, false);

self.addEventListener('notificationclick', function(event) {
    onClick(event);
}, false);

function onPush(event) {
    event.waitUntil(
        self.registration.pushManager.getSubscription().then(function(subscription) {
            subscriptionId = subscription.subscriptionId;
            if (!subscriptionId) {
                var parts = subscription.endpoint.split('/');
                subscriptionId = parts[parts.length - 1];
            }
            return fetch('/_/push/web_push_content/' + subscriptionId);
        }).then(function(response) {
            if (response.status != 200) {
                throw new Error();
            }
            return response.json();
        }).then(function(data) {
            if (data['error']) {
                throw new Error();
            }

            return self.registration.showNotification(data['title'], data['options']);
        }, function(err) {

        })
    );
}

function onClick(event) {
    event.notification.close();

    var url = '/';
    var action = null;
    var parts = event.notification.tag.split(':', 3);
    if (parts.length == 3) {
        action = parts[1];
        url = parts[2];
    } else {
        return;
    }

    if (action != 'notification') {
        return;
    }

    event.waitUntil(
        self.clients.matchAll({
            type: 'window'
        }).then(function() {
            if (self.clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
}
