

// Listen for install event, set callback
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});



self.addEventListener('push', event => {
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data.url;
    if (url) {
        event.waitUntil(clients.openWindow(url));
    }
});