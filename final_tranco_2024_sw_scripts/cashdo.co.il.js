self.addEventListener('push', function (event) {
    var data = event.data.json();
    console.log(event);
    const options = {
        body: data.text,
        icon: 'images/48.png',
        badge: 'images/48.png',
        data: data,
        vibrate: [300, 100, 400],
        dir: "rtl",
        requireInteraction:true
    };
    if (data.imageUrl) {
        options.image = data.imageUrl;
    }
    if (data.dir) {
        options.dir = data.dir;
    }

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
    var data = event.notification.data;
    if (data.url) {
        event.waitUntil(
            clients.openWindow(data.url)
        );
    }

});