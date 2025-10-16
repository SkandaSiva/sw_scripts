/// PWA Install Prompt

// Most likely needs to do something for offline use
self.addEventListener('install', (e) => {
});
self.addEventListener('fetch', (e) => {
});

function createBroadcastChannel() {
    try {
        return new BroadcastChannel('notifications');
    } catch (e) {
        return undefined;
    }
};

var notificationsBroadcast = createBroadcastChannel();

if (notificationsBroadcast) {
    importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

    self.addEventListener('push', function (event) {
        const data = event.data.json().data;

        var notificationOptions = {
            body: data.message,
            icon: data.icon,
            data: data
        };

        event.waitUntil(
            self.registration.showNotification(data.title, notificationOptions)
        );

        notificationsBroadcast.postMessage(data);
    });

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        event.waitUntil(
            clients
                .matchAll({
                    type: 'window',
                })
                .then((clientList) => {
                    if (clientList.length > 0 && 'focus' in clientList[0])
                        return clientList[0].focus();
                    if (clients.openWindow)
                        return clients.openWindow(event.notification.data.url || '/');
                })
        );
    });
}