'use strict';
var cacheName = 'app-v3';
var urlsToCache = ['manifest.json'];
self.addEventListener('fetch', function(event) {});
self.addEventListener('install', function(ev) {
    ev.waitUntil(caches.open(cacheName).then(function(cache) {
        cache.addAll(urlsToCache.map(function(el) {
            return el;
        }));
    }));
});
self.addEventListener('activate', function(ev) {
    ev.waitUntil(caches.keys().then(function(keyList) {
        keyList.forEach(function(key) {
            if (key !== cacheName)
                caches.delete(key);
        });
    }));
    return self.clients.claim();
});
self.addEventListener('push', function(event) {
    var data = event.data ? event.data.json().data : {};
    var title = data.title;
    if (!data || !title)
        return;
    var options = JSON.parse(data.options);
    event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = event.notification.data.url;
    event.waitUntil(clients.matchAll({
        type: 'window'
    }).then(function(windowClients) {
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus'in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
    }));
});
