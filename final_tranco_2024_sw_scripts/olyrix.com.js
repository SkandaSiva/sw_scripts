let pushPayload;

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    pushPayload = JSON.parse(event.data.text());

    const title = pushPayload.title;
    const options = {
        body: pushPayload.body,
        icon: 'https://olyrix.com/assets/images/logo-o-pourpre.png',
        badge: 'https://olyrix.com/assets/images/logo-o-pourpre.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow(pushPayload.url)
    );
});
