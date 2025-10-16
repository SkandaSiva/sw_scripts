var version = '1902041022';
var cacheKey = 'offlineCache' + version;
var cacheWhitelist = [cacheKey];
var offlineUrls = [
    '/offline',
    '/icons/f7dd137a-1d4c-1a8c-1d2a-6215fc376313.png?v=YzNlN'
];
var enableCache = false;

self.addEventListener('activate', function(event) {
    //self.skipWaiting();
    if (typeof caches !== "undefined") {
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
});

self.addEventListener('install', function(event) {
    self.skipWaiting();
    if (typeof caches !== "undefined" && enableCache) {
        event.waitUntil(
            caches.open(cacheKey).then(function (cache) {
                return cache.addAll(offlineUrls);
            })
        );
    }
});

self.addEventListener('push', (event) => event.waitUntil(
    event.data.json().data.title, event.data.json()
));

self.addEventListener('push', function(e) {
    var data = null;
    try {
        if (e.data) {
            data = e.data.json();
        }
    } catch (err) {/* idle */}
    if (!data) {
        return;
    }
    var title = data && typeof data.data !== "undefined" && typeof data.data.title !== "undefined" ? data.data.title : "";
    e.waitUntil(
        self.registration.showNotification(title, data)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.action === 'close') {
        // idle
    } else if (typeof event.notification.data.url !== "undefined") {
        clients.openWindow(event.notification.data.url);
    }
}, false);


if (typeof caches !== "undefined" && enableCache) {
    self.addEventListener('fetch', function(event) {
        var url = new URL(event.request.url);
        if (/(?:\.js$|\.css$|\.png$|\.json$|\.ico$|\.svg|\.woff2$\.jpe?g$|^\/offline$)/.exec(url.pathname)) {
            event.respondWith(
                caches.open(cacheKey).then(function(cache) {
                    return cache.match(event.request).then(function (response) {
                        return response || fetch(event.request).then(function(response) {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
                })
            );
        } else if (event.request.mode === 'navigate') {
            return event.respondWith(
                fetch(event.request).catch(function(){
                    return caches.match(offlineUrls[0]);
                })
            );
        }
        // return event.respondWith(fetch(event.request));
    });
}