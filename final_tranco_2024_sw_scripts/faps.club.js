var staticCacheName = "pwa-ws-v-" + new Date().getTime();
var filesToCache = [
    '/offline',
    '/build/assets/app-830ea241.css',
    '/favicon.png',
    '/pwaicon-192.png'
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-ws-v-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('offline');
            })
    )
});


self.addEventListener('push', function (e) {
if (!(self.Notification && self.Notification.permission === 'granted')) {
return;
}

if (e.data) {

var msg = e.data.json();
e.waitUntil(self.registration.showNotification(msg.title, {
body: msg.body,
icon: msg.icon,
actions: msg.actions,
data: msg.data
}));
}
});

self.addEventListener('notificationclick', function(e) {

e.notification.close();
const url = e.notification.data.url;
e.waitUntil(clients.openWindow(url));
});