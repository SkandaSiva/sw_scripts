self.addEventListener('push', function(event) {
    // console.log('[Service Worker] Push Received.');
    // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let payload = {};
    if (event.data) {
        payload = event.data.json();
    }
    let title = payload.title;
    let options = {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        image: payload.image,
        topic: payload.topic,
        clickTarget: payload.clickTarget
    };
    self.clickTarget = payload.clickTarget;

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow(self.clickTarget)
    );
});

self.addEventListener('install', function(event) {
    return self.skipWaiting();
});
