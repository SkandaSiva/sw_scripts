(function () {
    'use strict';

    // Update 'version' if you need to refresh the cache
    const version = 'v1.14::MIRA';
    const offlineUrl = "offline.html"; // <-- Offline/Index.cshtml
    const urlsToCache = [
        offlineUrl,
        "/",
    ]; // <-- Add more URLs you would like to cache.

    // Store core files in a cache (including a page to display when offline)
    function updateStaticCache() {
        return caches.open(version)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            });
    }

    function addToCache(request, response) {
        let cacheControlHeader = response.headers.get('Cache-control');
        let noStore = cacheControlHeader != null && cacheControlHeader.includes("no-store");
        let isNotOk = !response.status == 200;
        let isNonDomain = response.type === 'opaque';

        if (isNotOk || isNonDomain || noStore) {
            return;
        }

        var copy = response.clone();
        caches.open(version)
            .then(function (cache) {
                cache.put(request, copy);
            });


    }

    function serveOfflineImage(request) {
        let acceptHeader = request.headers.get('Accept');
        if (acceptHeader != null && acceptHeader.includes("image")) {
            return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
    }

    self.addEventListener('install', function (event) {
        event.waitUntil(updateStaticCache());
    });

    self.addEventListener('activate', function (event) {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {
                    return cacheNames.filter(cacheName => cacheName !== version);
                })
                .then(function (keys) {
                    // Remove caches whose name is no longer valid
                    return Promise.all(keys
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

    self.addEventListener('fetch', function (event) {
        var request = event.request;
        var ajaxHeader = request.headers.get("X-Requested-With");

        // Always fetch non-GET And Ajax requests from the network
        if (request.method !== 'GET' || request.url.match(/\/browserLink/ig) || (ajaxHeader != null && ajaxHeader.includes("XMLHttpRequest"))) {
            event.respondWith(
                fetch(request)
                    .catch(function () {
                        return caches.match(offlineUrl);
                    })
            );
            return;
        }

        // Skip cross-origin requests
        if (request.url.startsWith(self.location.origin)) {
            // For HTML requests, try the network first, fall back to the cache, finally the offline page
            var accept = request.headers.get('Accept');
            if (accept != null && accept.includes("text/html")) {
                event.respondWith(
                    fetch(request)
                        .then(function (response) {
                            // Stash a copy of this page in the cache
                            addToCache(request, response);
                            return response;
                        })
                        .catch(function () {
                            return caches.match(request)
                                .then(function (response) {
                                    return response || caches.match(offlineUrl);
                                });
                        })
                );
                return;
            }

            // cache first for fingerprinted resources
            if (request.url.match(/(\?|&)v=/ig)) {
                event.respondWith(
                    caches.match(request)
                        .then(function (response) {
                            return response || fetch(request)
                                .then(function (response) {
                                    addToCache(request, response);
                                    return response || serveOfflineImage(request);
                                })
                                .catch(function () {
                                    return serveOfflineImage(request);
                                });
                        })
                );
                return;
            }

            // network first for non-fingerprinted resources
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        // Stash a copy of this page in the cache
                        addToCache(request, response);
                        return response;
                    })
                    .catch(function () {
                        return caches.match(request)
                            .then(function (response) {
                                return response || serveOfflineImage(request);
                            })
                            .catch(function () {
                                return serveOfflineImage(request);
                            });
                    })
            );
        }




    });

})();