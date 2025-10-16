const CACHE_NAME = 'kycport-cache-v1';

self.addEventListener('install', function (event) {
    console.log('Service Worker installing');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll([
                '/logo.png',
            ]);
        })
    );
    // Skip waiting, allowing the new service worker to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker activating');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('push', function (event) {
    console.log('Push message received', event);

    let notificationData = {};
    if (event.data) {
        notificationData = event.data.json();
    }
    const domain = 'https://www.kycport.com';
    const channel = new BroadcastChannel('notification-channel');

    const title = notificationData.title || 'New Notification';
    const href = notificationData.href ? (
        notificationData.href.startsWith('http') ? notificationData.href : `${domain}${notificationData.href}`
    ) : domain;
    const options = {
        body: notificationData.body || 'You have a new notification',
        icon: notificationData.icon || '/logo.png',
        badge: notificationData.badge || '/logo.png',
        vibrate: notificationData.vibrate || [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            href: href
        },
        actions: notificationData.actions || [
            { action: 'explore', title: 'Go to the site' },
            { action: 'close', title: 'Close notification' },
        ]
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            channel.postMessage({ type: 'GET_NOTIFICATION', payload: { timestamp: Date.now() } })
        ])
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received', event);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow(event.notification.data.href)
        );
    }
});

// Add a message event listener to handle skipWaiting
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
