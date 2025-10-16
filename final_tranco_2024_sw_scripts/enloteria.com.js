// public/service-worker.js

self.addEventListener('push', (event) => {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: '/assets/android-chrome-512x512-ab9c081c8516614a0b7f6f20136f6908dd682867367ca923a719af65bb975e25.png',
        data: {
            url: data.url
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // Extract the URL from the notification data
    const targetUrl = event.notification.data.url;

    event.waitUntil(
        clients.openWindow(targetUrl)
    );
});
