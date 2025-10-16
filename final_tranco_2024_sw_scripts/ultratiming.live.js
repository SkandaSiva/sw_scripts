self.addEventListener('install', () => {
    return self.skipWaiting();
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const notification = event.notification;

    event.waitUntil(
        clients.openWindow(notification.data.url ?? 'https://www.ultratiming.live/')
    );
});

self.addEventListener('push', event => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const notification = event.data.json();
    const data = {};

    if (notification.resourceUrl) {
        data.url = notification.resourceUrl;
    }

    return self.registration.showNotification(
        notification.title,
        {
            data: data,
            body: notification.message,
            icon: '/android-chrome-192x192.png',
            tag: 'ultratiming',
            lang: 'fr',
        },
    );

});

