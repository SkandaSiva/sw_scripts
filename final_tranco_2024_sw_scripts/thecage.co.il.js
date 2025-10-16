self.addEventListener('push', function (event) {
    var obj = event.data.json();
    var options = obj.options;
    options.data = {
        url: obj.url
    };
    var promise = self.registration.showNotification(obj.title, options);
    event.waitUntil(promise);
});

self.addEventListener('notificationclick', function (event) {

    var url = event.notification.data.url;
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();
    if (!url) {
        return;
    }
    // This looks to see if the current window is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === url && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

const OFFLINE_URL = "/offline.php?";

const CACHE_NAME = 'static-cache';
const urlsToCache = [
    OFFLINE_URL
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});


self.addEventListener('fetch', function (event) {
    if (!navigator.onLine && event.request.mode === 'navigate') {
        return event.respondWith(
            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
        );
    }

});
