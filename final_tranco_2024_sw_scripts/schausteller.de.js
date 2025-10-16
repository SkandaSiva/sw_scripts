importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
if (workbox) {
    workbox.setConfig({debug: false});
    workbox.routing.registerRoute(
        /\.(?:css|png)$/,
        new workbox.strategies.NetworkFirst(),
    );
    workbox.routing.registerRoute(
        new RegExp('.*\.js'),
        new workbox.strategies.NetworkFirst()
    );
}
self.addEventListener('push', function(event) {

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = push => {
        const { title, ...rest } = push;
        return self.registration.showNotification(title, rest);
    };

    if (event.data) {
        const pushData = event.data.json();
        console.log(pushData);
        event.waitUntil(sendNotification(pushData));
    }
});

self.addEventListener('notificationclick', function(event) {

    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});