(function () {
    "use strict";

    // Update 'version' if you need to refresh the cache
    var version = '4';
    var offlineUrl = "/offline.html";
    var routes = "";
    var routesToIgnore = "'/episerver','/elmah','/util','/ui','/stott.robotshandler','/GetaNotFoundHandlerAdmin','/SqlStudio','/admin','/_content'";
    // split routes string to array and remove surrounding quotes
    routesToIgnore = routesToIgnore.replace(/['"]+/g, '');
    var routesToIgnoreArray = routesToIgnore.split(',');

    //add offlineurl in cache if not present
    caches.open(version).then(function (cache) {
        cache.match(offlineUrl).then(function (response) {
            if (!response) {
                cache.add(offlineUrl);
            }
        });
    });

    // Store core files in a cache (including a page to display when offline)
    function updateStaticCache() {
        return caches.open(version).then(function (cache) {
            return cache.add(offlineUrl);
        });
    }

    function addToCache(request, response) {
        if (!response.ok && response.type !== "opaque") return;

        var copy = response.clone();
        caches.open(version).then(function (cache) {
            if (request.url.match("^(http|https)://")) {
                cache.put(request, copy);
            } else {
                return;
            }
        });
    }

    function serveOfflineImage(request) {
        if (request.headers.get("Accept").indexOf("image") !== -1) {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="150px" height="150px" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" fill="#EFF1F3"/><path fill-rule="evenodd" clip-rule="evenodd" d="M33.2503 38.4816C33.2603 37.0472 34.4199 35.8864 35.8543 35.875H83.1463C84.5848 35.875 85.7503 37.0431 85.7503 38.4816V80.5184C85.7403 81.9528 84.5807 83.1136 83.1463 83.125H35.8543C34.4158 83.1236 33.2503 81.957 33.2503 80.5184V38.4816ZM80.5006 41.1251H38.5006V77.8751L62.8921 53.4783C63.9172 52.4536 65.5788 52.4536 66.6039 53.4783L80.5006 67.4013V41.1251ZM43.75 51.6249C43.75 54.5244 46.1005 56.8749 49 56.8749C51.8995 56.8749 54.25 54.5244 54.25 51.6249C54.25 48.7254 51.8995 46.3749 49 46.3749C46.1005 46.3749 43.75 48.7254 43.75 51.6249Z" fill="#687787"/></svg>',
                { headers: { "Content-Type": "image/svg+xml" } }
            );
        }
    }

    self.addEventListener("install", function (event) {
        event.waitUntil(updateStaticCache());
    });

    self.addEventListener("push", (event) => {
        var payload = event.data ? event.data.text() : "no payload";

        var parsedData = JSON.parse(payload);

        var title = parsedData.title;
        var message = parsedData.message;
        var url = parsedData.url;
        var category = parsedData.category;

        event.waitUntil(
            self.registration.showNotification(title, {
                body: message,
                data: {
                    url: url
                },
            }),
        );
    });

    self.addEventListener('notificationclick', function (event) {
        console.log('Notification clicked', event);
        event.notification.close();
        var payload = event.notification.data;

        var url = payload.url;
        if (url) {
            event.waitUntil(
                clients.openWindow(url)
            );
        } else {
            event.waitUntil(
                console.log("URL not provided")
            );
        }
    });


    self.addEventListener("activate", function (event) {
        event.waitUntil(
            caches.keys().then(function (keys) {
                // Remove caches whose name is no longer valid
                return Promise.all(
                    keys
                        .filter(function (key) {
                            return key.indexOf(version) !== 0;
                        })
                        .map(function (key) {
                            return caches.delete(key);
                        })
                );
            })
        );
    });

    self.addEventListener("fetch", function (event) {
        var request = event.request;

        // Ignore requests in the ignoreRoutes list
        if (routesToIgnoreArray.length > 0) {
            for (var i = 0; i < routesToIgnoreArray.length; i++) {
                if (request.url.match(routesToIgnoreArray[i])) {
                    return false;
                }
            }
        }

        // Always fetch non-GET requests from the network
        if (request.method !== "GET" || request.url.match(/\/browserLink/gi)) {
            event.respondWith(
                fetch(request).catch(function () {
                    return caches.match(offlineUrl);
                })
            );
            return;
        }

        // For HTML requests, try the network first, fall back to the cache, finally the offline page
        if (request.headers.get("Accept").indexOf("text/html") !== -1) {
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        // Stash a copy of this page in the cache
                        //addToCache(request, response); kept this method here for later use
                        return response;
                    })
                    .catch(function () {
                        return caches.match(request).then(function (response) {
                            return response || caches.match(offlineUrl);
                        });
                    })
            );
            return;
        }

        // cache first for fingerprinted resources
        if (request.url.match(/(\?|&)v=/gi)) {
            event.respondWith(
                caches.match(request).then(function (response) {
                    return (
                        response ||
                        fetch(request)
                            .then(function (response) {
                                //addToCache(request, response);
                                return response || serveOfflineImage(request);
                            })
                            .catch(function () {
                                return serveOfflineImage(request);
                            })
                    );
                })
            );

            return;
        }

        // network first for non-fingerprinted resources
        event.respondWith(
            fetch(request)
                .then(function (response) {
                    // Stash a copy of this page in the cache
                    //addToCache(request, response);
                    return response;
                })
                .catch(function () {
                    return caches
                        .match(request)
                        .then(function (response) {
                            return response || serveOfflineImage(request);
                        })
                        .catch(function () {
                            return serveOfflineImage(request);
                        });
                })
        );
    });
})();
