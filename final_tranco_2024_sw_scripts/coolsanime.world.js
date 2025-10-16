self.addEventListener('push', function(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let data = event.data ? event.data.json() : {};

    const options = {
        title: data.title || 'Notification',
        body: data.body || 'Default message',
        icon: data.icon || '/default-icon.png',
        image: data.image || 'https://old.coolsanime.me/path/to/large-image.jpg',
        badge: data.badge || 'https://old.coolsanime.me/path/to/badge-icon.png',
        data: data.url || '/', // URL to open on click
        actions: (data.actions || []).map(action => ({
            action: action.action,
            title: action.title,
            icon: action.icon
        }))
    };

    // Debugging log
    console.log('Notification options:', options);

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click, including actions
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification when clicked

    if (event.action === 'open' || !event.action) {
        // Open the URL specified in data if action is 'open' or default click
        event.waitUntil(clients.openWindow(event.notification.data));
    } else if (event.action === 'dismiss') {
        // Handle dismiss action if needed (e.g., analytics)
        console.log('Notification dismissed');
    }
});