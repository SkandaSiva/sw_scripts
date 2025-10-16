const config = {
    cacheName: "axminster-sw-v1"
};

self.addEventListener('install', () => {
    self.skipWaiting();
});

const pwa = {
    cacheName: "axminster-pwa-v1",
    offlineUrl: "https://www.axminstertools.com/offline/",
};

self.addEventListener("install", (e) => {
    self.skipWaiting();

    e.waitUntil(
        caches.open(pwa.cacheName).then(function (cache) {
            cache.add(pwa.offlineUrl);
        })
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        (async function () {
            if (self.registration.navigationPreload) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );
});

self.addEventListener("fetch", (e) => {
    if (e.request.mode === "navigate") {
        e.respondWith(
            (async () => {
                try {
                    let preloadResponse = await e.preloadResponse;
                    if (preloadResponse) return preloadResponse;

                    let networkResponse = await fetch(e.request);
                    return networkResponse;
                } catch (error) {
                    let cachedResp = await caches.match(pwa.offlineUrl);
                    if (cachedResp) return cachedResp;

                    throw error;
                }
            })()
        );
    }
});

self.addEventListener('push', (e) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = (payload) => {
        payload.title ??= 'Axminster Tools';

        return self.registration.showNotification(payload.title, payload);
    }

    if (e.data) {
        const payload = e.data.json();

        e.waitUntil(sendNotification(payload));
    }
});

self.addEventListener('notificationclick', (e) => {
    e.notification.close();

    e.waitUntil(
        clients.matchAll({
            type: 'window',
        })
        .then(() => {
            if (!e.notification.data.hasOwnProperty('url')) {
                return;
            }

            return clients.openWindow(e.notification.data.url);
        }),
    );
});

self.addEventListener('pushsubscriptionchange', function(e) {
    e.waitUntil(
        fetch('', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                old_endpoint: e.oldSubscription ? e.oldSubscription.endpoint : null,
                new_endpoint: e.newSubscription ? e.newSubscription.endpoint : null,
                new_p256dh: e.newSubscription ? e.newSubscription.toJSON().keys.p256dh : null,
                new_auth: e.newSubscription ? e.newSubscription.toJSON().keys.auth : null
            })
        })
    );
});
