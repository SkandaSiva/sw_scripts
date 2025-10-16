self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var data = {};
    if (event.data) {
        data = event.data.json();
    }

    var title = data.title;
    var options = data.options;
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action != undefined && event.action != "") {
        var actionResult = event.notification.data.actions;
        if (actionResult != undefined) {
            var action = actionResult.find(o => o.action == event.action);
            if (action != undefined) {
                urlHandler(action.url, event);
            }
        }
    }
    else if (event.notification.data.url != undefined) {
        var url = event.notification.data.url;
        urlHandler(url, event);
    }
});

var urlHandler = function (urlPart, event) {
    if (urlPart != undefined) {
        var url = new URL(urlPart, self.location.origin).href;
        event.waitUntil(
            clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(windowClients => {
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
    return;
};

var cacheVersion = 11;
var currentCache = {
    offline: 'offline-cache' + cacheVersion
};
const OFFLINE_URL = '/offline.html';
const LOGO_URL = '/cache/getlogo';
const SAFEHOSTS = ["www.vmcdn.ca", "vmcdn.ca", "www.bpmcdn.com", "bpmcdn.com"];

var urlsToPrefetch = [
    LOGO_URL,
    OFFLINE_URL,
];

self.addEventListener('install', event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(currentCache.offline)
            .then(function (cache) {
                return cache.addAll(urlsToPrefetch);
            })

    );
});

// Delete all caches that aren't named in currentCache.
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());

    let expectedCacheNames = Object.keys(currentCache).map(function (key) {
        return currentCache[key];
    });
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {

    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    if (!SAFEHOSTS.includes(url.host) && url.host != self.location.host) {
        event.respondWith(
            fetch(event.request).catch((error) => {
                console.log("Failed to fetch resource: " + event.request.url, error);
            })
        );
    }
    else {
        if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
            //if homepage request, update getlogo 
            if (url.pathname === "/") {
                caches.open(currentCache.offline)
                    .then(function (cache) {
                        cache.match(LOGO_URL).then(function (response) {
                            var date = new Date(response.headers.get("Date"));
                            date.setMonth(date.getMonth() + 6);
                            if (date < new Date()) {
                                fetch(LOGO_URL)
                                    .then(function (response) {
                                        var responseToCache = response.clone();
                                        cache.put(LOGO_URL, responseToCache);
                                    });
                            }
                        });
                    });
            }

            event.respondWith(
                fetch(event.request).catch(() => {
                    //return the offline page
                    return caches.match(OFFLINE_URL);
                })
            );
        }
        else {
            event.respondWith(async function () {
                if (url.pathname.split('.').pop() === "woff2" || url.pathname.startsWith("/files/ui")) {
                    //return from cache or add to cache if not in cache
                    return await caches.match(event.request).then(function (match) {
                        if (typeof match === "undefined" || match === null) {
                            //add any css or font woff2 files to cache if not present.
                            return fetch(event.request)
                                .then(function (response) {
                                    if (response.status == 200) {
                                        var responseToCache = response.clone();
                                        caches.open(currentCache.offline)
                                            .then(function (cache) {
                                                cache.put(event.request, responseToCache);
                                            });
                                    }
                                    return response;
                                }).catch((error) => {
                                    console.log("Failed to fetch resource: " + event.request.url, error);
                                });
                        }
                        else {
                            return match;
                        }
                    });
                }
                else if (url.pathname.startsWith("/cssb/") || url.pathname.startsWith("/jsb/")) {
                    //return from cache or add to cache if not in cache
                    return await caches.match(event.request).then(function (match) {
                        if (typeof match === "undefined" || match === null) {
                            return fetch(event.request)
                                .then(function (response) {
                                    if (response.status == 200) {
                                        var responseToCache = response.clone();
                                        caches.open(currentCache.offline)
                                            .then(function (cache) {
                                                cache.matchAll(event.request, { ignoreSearch: true }).then(function (matches) {
                                                    if (matches.length > 1 || (matches.length === 1 && matches[0].url !== event.request.url)) {
                                                        cache.delete(event.request, { ignoreSearch: true });
                                                        cache.put(event.request, responseToCache);
                                                    }
                                                    else if (matches.length === 0) {
                                                        cache.put(event.request, responseToCache);
                                                    }
                                                });
                                            });
                                    }
                                    return response;
                                }).catch((error) => {
                                    console.log("Failed to fetch resource: " + event.request.url, error);
                                });
                        }
                        else {
                            return match;
                        }
                    });
                }
                else {
                    return await caches.match(event.request).then(function (match) {
                        if (match) {
                            return match;
                        }
                        return fetch(event.request).catch((error) => {
                            console.log("Failed to fetch resource: " + event.request.url, error);
                        });
                    });
                }
            }());
        }
    }
});