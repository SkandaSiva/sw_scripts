const version = 4;
const cacheName = `milfey-cache-${version}`;
const cacheEnabled = true;

const filesToCache = [
    'images/manifest.json',
    'offline.html',
    'catalog/view/theme/milfey/assets/fonts/Gotham Pro/gothampro.ttf',
    'catalog/view/theme/milfey/assets/fonts/Gotham Pro/gothampro_medium.ttf',
    'catalog/view/theme/milfey/assets/fonts/manrope/manrope_400.ttf',
    'catalog/view/theme/milfey/assets/fonts/manrope/manrope_500.ttf',
    'catalog/view/theme/milfey/assets/fonts/manrope/manrope_700.ttf',
];

const openWindow = (url) => {
    return clients
        .openWindow(url)
        .then((windowClient) => {
            console.log('[Service Worker]: Opened window', windowClient);
            return windowClient;
        })
        .catch((error) => {
            console.error('[Service Worker]: Error opening window', error);
            throw new Error(error);
        });
};

// Очищает старый кэш
const activateHandler = e => {
    e.waitUntil(caches.keys()
        .then(names => Promise.all(
            names.filter(name => name !== cacheName).map(name => caches.delete(name))
        ))
    );

    return self.clients.claim();
};

// 'install' вызывается, как только пользователь впервые открывает PWA
const installHandler = e => {
    if (cacheEnabled) {
        e.waitUntil(
            caches.open(cacheName)
                .then(cache => cache.addAll(filesToCache))
                .then(() => self.skipWaiting())
        );
    }
};

// Когда приложение запущено, сервис-воркер перехватывает запросы и отвечает на них данными из кэша, если они есть и обновит старый кэш
const fetchHandler = e => {
    var url = e.request.url,
        origin = self.location.origin;

    if (e.request.method === 'GET' && cacheEnabled && url.startsWith(origin) && !(url.startsWith(origin + '/admin') || url.endsWith('.webm') || url.endsWith('.ogv') || url.endsWith('.mp4') || url.startsWith(origin + '/checkout') || url.startsWith(origin + '/index.php?route=checkout/checkout') || url.startsWith(origin + '/index.php?route=extension/payment'))) {
        e.respondWith(
            networkOrCache(e.request).catch((error) => useFallback(error, e.request))
        );
    }
};

async function messageClient(e, messageType, data = {}) {
    var message = {
        type: messageType,
        data: data,
    };

    if (!e.clientId) {
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
            client.postMessage(message);
        }
    } else {
        const client = await self.clients.get(e.clientId);
        if (!client) return;

        client.postMessage(message);
    }
}

// Получение пуш-уведомления
const pushHandler = e => {
    try {
        var notificationData = e.data.json();
        const messageClientPromise = messageClient(
            e,
            'NOTIFICATION_RECEIVED',
            notificationData
        );

        const showNotificationPromise = self.registration.showNotification(
            notificationData.title,
            notificationData
        );
        const promiseChain = Promise.all([
            messageClientPromise,
            showNotificationPromise,
        ]);

        e.waitUntil(promiseChain);
    } catch (error) {
        console.error('[Service Worker]: Error parsing notification data', error);
    }
};

self.addEventListener('notificationclick', function(event) {
    event.waitUntil(
        // Retrieve a list of the clients of this service worker.
        self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window',
        }).then(function(clientList) {
            var notificationData = {};

            try {
                notificationData = e.data.json();
            } catch (error) {
                notificationData = event.notification.data;
                console.error('[Service Worker]: Error parsing notification data', error);
            }
            var urlToOpen = notificationData.hasOwnProperty('urlToOpen') ? notificationData.urlToOpen : '/';

            // If there is at least one client, focus it.
            if (clientList.length > 0) {
                return clientList[0].focus();
            }

            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    client.postMessage(data);
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );

    event.notification.close();
});

function networkOrCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request)
            .then(function (response) {
                return cache.put(request, response.clone()).then(function () {
                    return response;
                });
            })
            .catch(function (e) {
                console.log(e);
                return fromCache(request);
            });
    });
}

function fromCache(request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function useFallback(error, request = null) {
    console.error(request.url + '[onfetch] Failed. Serving cached offline fallback ' + error);
    if (request.method === 'GET' && request.destination === 'document') {
        return caches.open(cacheName).then(function (cache) {
            return cache.match('offline.html');
        });
    }
}

self.addEventListener('install', installHandler);
self.addEventListener('activate', activateHandler);
self.addEventListener('fetch', fetchHandler);
self.addEventListener('push', pushHandler);