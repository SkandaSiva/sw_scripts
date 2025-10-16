'use strict';

self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('service worker installed');
});

self.addEventListener('fetch', function(event) {
    return;
});

self.addEventListener('push', function (event) {
    const payload = event.data.json();

    return self.registration.showNotification(payload.notification.alert.title, {
        body: payload.notification.alert.body,
        actions: payload.data.hasOwnProperty('actions') ? payload.data.actions : [],
        silent: !payload.notification.hasOwnProperty('sound'),
        data: payload.data,
        icon: '/graphic/browser_notification.png',
        tag: payload.data.hasOwnProperty('tag') ? payload.data.tag : 'default'
    });
});

self.addEventListener('notificationclick', function (event) {
    const data = event.notification.data;

    var openUrl = '/';

    if (data.hasOwnProperty('support_url')) {
        openUrl = data.support_url;
    }

    event.waitUntil(clients.openWindow(openUrl));
});