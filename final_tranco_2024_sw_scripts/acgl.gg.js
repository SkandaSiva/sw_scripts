"use strict";

const CACHE_VERSION = 1 /*cacheVersion*/;
const CACHE_EXCLUDE = [ /*cacheConditionsExclude*/].map(function (r) { return new RegExp(r); });
let CACHE_URLS = [ /*cacheUrls*/];
const CACHE_URLS_ASSETS = [ /*cacheUrlsAssets*/];
const CACHE_PREFIX = 'pwa-main-';
const CACHE_CURRENT = CACHE_PREFIX + CACHE_VERSION;
let CACHE_ACTIVE = true;

const CACHE_OFFLINE = '/offline';
CACHE_URLS.push(CACHE_OFFLINE);

function pwaUninstallServiceWorker() {
    return self.registration.unregister()
        .then(function (success) {
            if (success) {
                caches.keys().then(function (names) { // Delete all Caches that belong to the PWA module.
                    for (let name of names) {
                        if (name.indexOf(CACHE_PREFIX) !== -1) {
                            caches.delete(name);
                        }
                    }

                    CACHE_ACTIVE = false; // Disallow any future cache.put() coming from fetch listeners.
                });
            }
        })
}

self.addEventListener('push', function (event) {

    var data = JSON.parse(event.data.text());

    event.waitUntil( // Keep the service worker alive until the notification is created
        self.registration.showNotification(data.site_title, {
            body: data.body,
            icon: data.icon,
            badge: data.icon,
            tag: data.url,
            renotify: true,
            data: data.url,
        })
    );
});

self.addEventListener('notificationclick', function (event) {

    self.registration.getNotifications().then(notifications => { // Close all notifications when the user clicks one
        notifications.forEach(notification => {
            notification.close();
        });
    });

    var url = event.notification.data ? event.notification.data : '/';
    const urlToOpen = new URL(url + '?src=pwa_click', self.location.origin).href;

    const promiseChain = clients.matchAll({
        type: 'window',
    })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === urlToOpen) {
                    return windowClient.focus();
                } else {
                    windowClient.navigate(urlToOpen);
                    return windowClient.focus();
                }
            }
            return clients.openWindow(urlToOpen);
        });

    event.waitUntil(promiseChain);

});

self.addEventListener('install', function (event) {
    if (CACHE_URLS.length) {
        event.waitUntil(caches
            .open(CACHE_CURRENT)
            .then(function (cache) {
                return Promise.all(CACHE_URLS.concat(CACHE_URLS_ASSETS).map(function (url) {
                    return fetch(url, { credentials: 'same-origin', mode: 'no-cors' })
                        .then(function (response) {
                            return cache.put(url, response);
                        })
                        .catch(function (error) {
                            logError(error);
                        });
                }));
            }));
    }
});

self.addEventListener('activate', function (event) {
    var tasks = [
        self.clients.claim(),
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName.indexOf(CACHE_PREFIX) === 0 && cacheName.indexOf(CACHE_CURRENT) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    ];

    event.waitUntil(Promise.all(tasks));
});

function urlNotExcluded(url) {
    return function (condition) {
        return !condition.test(url);
    }
}

function catchOffline(error) {
    return caches.match(CACHE_OFFLINE);
}

function logError(error) {
    console.error(error);
    return Response.error();
}

function isCacheableAsset(assetUrl) {
    if (isAssetUrl(assetUrl) || isImageUrl(assetUrl)) {
        return true;
    }

    return false;
}

function isAssetUrl(assetUrl) {
    return /\.(eot|woff2?|ttf|otf)\??/.test(assetUrl.href);
}

function isImageUrl(imageUrl) {
    return /\.(jpe?g|png|gif|webp)\??/.test(imageUrl.href);
}

self.addEventListener('fetch', function (event) {

    function fetchResourceFromCache(request) {
        return caches.match(request.url ? request : event.request);
    }

    function returnResourceFromCache(response) {
        if (!response) {
            return Promise.reject(new Error('Resource not in cache'));
        }
        return response;
    }

    function fetchResourceFromNetwork() {
        return fetch(event.request);
    }

    function cacheNetworkResponse(response) {
        if (response.ok) {
            var copy = response.clone();

            if (CACHE_ACTIVE) {
                caches
                    .open(CACHE_CURRENT)
                    .then(function (cache) {
                        return cache.put(event.request, copy);
                    })
                    .catch(logError);
            } else {
                //    console.debug('PWA: The Service Worker has been uninstalled so cache.put() was skipped.');
            }
        } else {
            fetch(event.request, { mode: 'no-cors' })
                .then(function (response) {
                    if (response.ok) {
                        var copy = response.clone();

                        if (CACHE_ACTIVE) {
                            caches
                                .open(CACHE_CURRENT)
                                .then(function (cache) {
                                    return cache.put(event.request, copy);
                                })
                                .catch(logError);
                        } else {
                            //    console.debug('PWA: The Service Worker has been uninstalled so cache.put() was skipped.');
                        }
                    }
                })
                .catch(function (error) {
                    logError(error);
                    //  console.error("PWA: Response not cacheable ", response);
                });
        }

        return response;
    }

    var url = new URL(event.request.url);
    var isMethodGet = event.request.method === 'GET';
    var notExcludedPath = CACHE_EXCLUDE.every(urlNotExcluded(url.href));
    var includedProtocol = ['http:', 'https:'].indexOf(url.protocol) !== -1;

    var makeRequest = {
        staleWhileRevalidate: function (request) {
            return fetchResourceFromCache(request)
                .then(returnResourceFromCache)
                .catch(function (error) {
                    return fetchResourceFromNetwork(error)
                        .then(cacheNetworkResponse);
                })
                .catch(logError);
        },
        networkWithCacheFallback: function (request) {
            return fetch(request)
                .then(returnResourceFromCache)
                .catch(catchOffline);
        }
    };

    if (isMethodGet && includedProtocol && notExcludedPath) {
        if (isCacheableAsset(url)) {
            event.respondWith(makeRequest.staleWhileRevalidate(event.request));
        }
    }
});