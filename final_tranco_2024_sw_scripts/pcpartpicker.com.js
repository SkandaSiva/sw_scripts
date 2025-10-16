const OFFLINE_VERSION = 10;
const STATIC_CACHE_NAME = 'pp-static';

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    self.clients.claim();
});

self.addEventListener('push', function (event) {
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    event.waitUntil(
        self.registration.showNotification(data.head, {
            body: data.body,
            data: {
                url: data.url
            },
            icon: '/static/forever/img/push-icon.png'
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
