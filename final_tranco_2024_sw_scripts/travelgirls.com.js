const cacheVersion = '1';
let appFocused = false;

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", () => {
    return self.clients.claim();
});

self.addEventListener('message', e => {
    if (e.data && e.data.type === 'APP_FOCUS_CHANGE') {
        appFocused = !!e.data.visible;
    }
});

self.addEventListener('push', (e) => {
    try {
        if (!(self.Notification && self.Notification.permission === "granted")) {
            return;
        }

        const payload = e.data ? e.data.json() : {};
        const title = payload.notification?.title ?? 'New activity';
        const body = payload.notification?.body ?? 'You have got a new message';
        const unreadCounter = payload.data && payload.data.unreadCounter ? parseInt(payload.data.unreadCounter) : 0;

        e.waitUntil(
            self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(windowClients => {
                for (let i = 0; i < windowClients.length; i++) {
                    const windowClient = windowClients[i];
                    if (windowClient.focused) {
                        windowClient.postMessage({action: 'newActivity'});
                        break;
                    }
                }

                if (!appFocused) {
                    const originUrl = new URL(self.location.origin);
                    let path = 'tgv2_app_fe/';
                    if (originUrl.hostname === 'travelfriend.com') path = 'tgv2_app_fe/_tf/';
                    else if (originUrl.hostname === 'tg.local') path = '';

                    return self.registration.showNotification(title, {
                        body: body,
                        icon: (path+'android-chrome-192x192.png'),
                        badge: (path+'favicon-32x32.png')
                    });
                }
            })
        );

        e.waitUntil(navigator.setAppBadge(unreadCounter));
    }
    catch (e) {
        console.error('Service-WORKER Error', e);
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // Example of navigating to a specific URL upon notification click
    const urlToOpen = new URL('/conversations?clickOnNotification=1', self.location.origin).href;

    const promiseChain = clients.matchAll({type: 'window', includeUncontrolled: true}).then((windowClients) => {
            let matchingClient = null;
            for (let i = 0; i < windowClients.length; i++) {
                matchingClient = windowClients[i];
            }

            if (matchingClient) {
                return matchingClient.focus().then(client => {
                    client.postMessage({action: 'onNotificationClick', url: urlToOpen});
                    return client;
                });
            }
            else {
                return clients.openWindow(urlToOpen);
            }
        });

    event.waitUntil(promiseChain);
});
