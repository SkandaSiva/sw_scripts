self.addEventListener('push', function(event) {
    var jsonObj = event.data.json();
    var notificationData = { id: jsonObj.id, url: jsonObj.url };
    event.waitUntil(self.registration.showNotification(
          jsonObj.title, jsonObj.options));
});
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/pop/go/?id=' + event.notification.data.id + '&url=' + encodeURIComponent(event.notification.data.url) + '&action=' + encodeURIComponent(event.action))
    );
});
