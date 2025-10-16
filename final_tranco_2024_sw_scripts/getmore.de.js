'use strict';

self.addEventListener('push', function(event) {
    var payload = null;

    try {
        payload = event.data.json();
    } catch(e) {
        return;
    }

    if(!payload || !payload.text) {
        return;
    }

    var title = payload.subject || 'GETMORE';
    var options = {
        body: payload.text,
        data: {}
    };

    if(payload.hasOwnProperty('url')) {
        options.data.url = payload.url;
    }

    options.icon = '/img/v1/default/getmore-logo-mobile.png';

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if(event.notification && event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});