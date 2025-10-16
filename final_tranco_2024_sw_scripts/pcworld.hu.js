
self.addEventListener('push', function(event) {
    console.log('Event: ', event);
    if (event.data) {
        const data = event.data.json();
        console.log('This push event has data: ', data);
        const promiseChain = self.registration.showNotification(
            data.title,
            data.options
        );
        event.waitUntil(promiseChain);
    } else {
        console.log('This push event has no data.');
    }
});

self.addEventListener('notificationclick', function(event) {
console.log('event: ', event);
console.log('event.notification.data: ', event.notification.data);
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

self.addEventListener('pushsubscriptionchange', function(event) {
console.log('pushsubscriptionchange event start');
console.log('event', event);
    if (!event.oldSubscription || !event.newSubscription) {
        return;
    }
    event.waitUntil(
        fetch('https://pcwplus.hu/ajax_actions/refresh_subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
                new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
                new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
                new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
            })
        })
    );
});

