'use strict';

try {
    self.addEventListener('push', function (event) {
        // for Safari delete follow code
        // if (navigator.serviceWorker) {
        //     return;
        // }
        if (!(self.Notification && self.Notification.permission === 'granted')) {
            return;
        }

        var sendNotification = function sendNotification(title, options) {
            return self.registration.showNotification(title, options);
        };

        if (event.data) {
            var content = event.data.json();
            event.waitUntil(sendNotification(content.title, content.options));
        }
    });
    self.addEventListener('notificationclick', function (event) {
        var url = event.notification.data;
        var promiseChain = clients.openWindow(url);
        event.waitUntil(promiseChain);
    });
    // auto update service workers
    self.addEventListener('install', function (event) {
        event.waitUntil(self.skipWaiting());
    });
} catch (err) {
    if (window.console && window.console.error) {
        window.console.error(err.name + ':' + err.message);
    }
}