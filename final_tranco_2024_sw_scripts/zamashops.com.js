self.addEventListener('push', function(event) {
    console.log('Push event received:', event);

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        console.warn('Notification permission not granted.');
        return;
    }

    let pushData;
    
    try {
        pushData = event.data.json();
        console.log('Parsed push data:', pushData);

        const title = pushData.notification?.title || 'Zamashop';
        const body = pushData.notification?.body || 'New Update Received';
        const icon = pushData.data?.icon || 'https://zamashops.com/notification/images/icon.png';
        const badge = pushData.data?.badge || 'https://zamashops.com/notification/images/badge.png';
        const extraData = 'https://zamashops.com';

        const options = {
            body: body,
            icon: icon,
            badge: badge,
            data: { url: extraData },  // Store the extraData (URL) in the notification's data
            sound: 'default'
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (e) {
        console.error('Failed to parse push data:', e);
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked!', event);

    // Close the notification
    event.notification.close();

    // Directly open the static URL when the notification is clicked
    event.waitUntil(
        clients.openWindow('https://zamashops.com')
    );
});
