// In development, always fetch from the network and do not enable offline support.
// This is because caching would make development more difficult (changes would not
// be reflected on the first load after each change).
self.addEventListener('fetch', () => { });

// Handle push notifications
self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};
    console.log('Push received:', data);
    const options = {
        body: data.body,
        icon: '/icon-48.png', // Set the icon for all notifications
        image: data.image, // Use the article-specific image
        data: data.url // Store the URL in the notification data
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    console.log("notificationclick > event.notification.data: ", event.notification.data);
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});