self.addEventListener('push', function (event) {
    if (event.data) {
        var payload = JSON.parse(event.data.text());
        var title = payload.title;
        var body = payload.data;
        event.waitUntil(self.registration.showNotification(title, body));

    } else {
        console.log("Event does not have data...");
    }
});
self.addEventListener('notificationclick', function (event) {
    var a = event.notification.data.redirectUrl;
    if (void 0 !== event.action) {
        if (clients.openWindow){
            return clients.openWindow(a);
        }
    }
});