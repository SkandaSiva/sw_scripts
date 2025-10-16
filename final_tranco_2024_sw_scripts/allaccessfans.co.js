var staticCacheName = "allaccessfan-v" + new Date().getTime();
var filesToCache = [
    "/offline",
    "/assets/images/loading-dark.gif",
    "/assets/images/loading-light.gif",
    "/assets/images/offline.svg",
    "/images/icons/icon-72x72.png",
    "/images/icons/icon-96x96.png",
    "/images/icons/icon-128x128.png",
    "/images/icons/icon-144x144.png",
    "/images/icons/icon-152x152.png",
    "/images/icons/icon-192x192.png",
    "/images/icons/icon-384x384.png",
    "/images/icons/icon-512x512.png",
];

// Cache on install
self.addEventListener("install", (event) => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

// Clear cache on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) =>
                        cacheName.startsWith("allaccessfan-")
                    )
                    .filter((cacheName) => cacheName !== staticCacheName)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", (event) => {
    if (event.request.url.indexOf("streaming") !== -1) {
        return;
    }
    if (event.request.url.indexOf("content_images") !== -1) {
        return;
    }
    if (event.request.url.indexOf("original") !== -1) {
        return;
    }
    if (event.request.url.indexOf("media") !== -1) {
        return;
    }
    if (event.request.url.indexOf("tus") !== -1) {
        return;
    }
    if (event.request.url.indexOf("s3") !== -1) {
        return;
    }
    if (event.request.url.indexOf("base") !== -1) {
        return;
    }
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match("offline");
            })
    );
});

self.addEventListener("push", function (e) {
    if (!(self.Notification && self.Notification.permission === "granted")) {
        return;
    }
    if (e.data) {
        var msg = e.data.json();
        e.waitUntil(
            self.registration.showNotification(msg.title, {
                body: msg.body,
                icon: msg.icon,
                actions: msg.actions,
            })
        );
    }
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    if (event.action === "some_action") {
        // Do something...
    } else {
        event.waitUntil(self.clients.openWindow("/"));
    }
});
