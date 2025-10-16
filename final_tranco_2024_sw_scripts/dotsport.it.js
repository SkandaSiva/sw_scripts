
self.addEventListener('install', event => {
    console.log("Service Worker Installato");
    self.skipWaiting();
});

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        const title = body['title'];
        return self.registration.showNotification(title, body);
    };

    if (event.data) {
        const message = event.data.json();
        event.waitUntil(sendNotification(message));
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var d = event.notification.data.url;
    event.waitUntil(
      clients.openWindow(d)
    );
});
