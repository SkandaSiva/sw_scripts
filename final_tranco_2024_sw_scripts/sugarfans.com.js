self.addEventListener('install', event => {
    console.log('Service worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service worker activating...');
});

const appendNotiSeen = (url, id) => {
    if (typeof url === 'string' && url.includes('?')) {
        return url + '&notiSeen=' + id
    }

    return url + '?notiSeen=' + id;
}

self.addEventListener('push', function(e) {
    // Only send if not inside application
    const promise = clients.matchAll().then(function(c) {
        if (c.length === 0) {
            const payload = e.data ? JSON.parse(e.data.text()) : null;

            if (!payload) {
                return;
            }

            const options = {
                body: payload.message,
                icon: 'static/icons/icon48.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: '2',
                    url: appendNotiSeen(payload.link, payload.id)
                },
                tag: payload.tag,
                renotify: true
            };

            e.waitUntil(
                self.registration.showNotification(payload.title, options)
            );
        }
    });

    e.waitUntil(promise);
});

self.addEventListener('notificationclick', function(e) {
    const {notification} = e;

    notification.close();

    const promise = clients.matchAll().then(function(clis) {
        const client = clis.find(function(c) {
            c.visibilityState === 'visible';
        });

        if (client !== undefined) {
            client.navigate(notification.data.url);
            return client.focus();
        } else {
            // there are no visible windows. Open one.
            clients.openWindow(notification.data.url);
            return notification.close();
        }
    });

    e.waitUntil(promise);
});

self.addEventListener('fetch', function (event) {});
