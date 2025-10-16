self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var data = {};
    if (event.data) {
        data = event.data.json();
    }

    var title = data.title || "Имате ново съобщение в Запозналник";
    var message = data.message;
    var icon = data.icon;
    var url = data.url;

    event.waitUntil(self.registration.showNotification(title, {
        body: message,
        icon: icon,
        badge: '/Content/images/new-message.png',
        data: { url: url },
        tag: url,
        renotify: true
    }));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var urlToOpen = event.notification.data.url || "/";
    event.waitUntil(self.clients.openWindow(urlToOpen));
});

self.addEventListener("fetch", function (event) {});