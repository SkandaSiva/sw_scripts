var CACHE = 'cache-822-947',
    offlinePage = '/error/offline';

var serviceWorkerOrigins = [
    /^\/$/,
    /^\/kiosk\//
];

var urlsToCache = [
    '/',
    '/manifest',
    offlinePage
];

var patternsToCache = [
    /.jpg/,
    /.jpeg/,
    /.png/,
    /.css/,
    /.gif/,
    /.js/,
    /.woff/,
    /.ico/,
    /.svg/,
    /\/manifest/
];

var isCheckingForOnline = false,
    isOffline = false,
    useCache = true;

function shouldRetrieveFromCache(request) {
    if (!request || !request.url || !useCache) {
        return false;
    }

    for (var i = 0; i < patternsToCache.length; i++) {
        if (patternsToCache[i].test(request.url)) {
            return true;
        }
    }

    return false;
}

function isRequestingPage(request) {
    return request && request.mode === 'navigate';
}

function isSelfInstallCheck(request) {
    return request
        && request.referrer === '' 
        && request.cache === 'default'
        && serviceWorkerOrigins.find(function (originTest) { 
            return originTest.test(request.url.replace(location.origin, '')); 
        });
}

function isGetMethod(request) {
    return request && request.method === 'GET';
}

function isResource(request) {
    return request && /\/resources\//.test(request.url) && !patternsToCache.filter(p => p.test(request.url)).length;
}

function isTracking(request) {
    return request && (/google-analytics/.test(request.url) || /ai.0.js/.test(request.url));
}

self.addEventListener('install', function (evt) {
    console.log('installing service worker');

    evt.waitUntil(
        caches.open(CACHE).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', function (evt) {
    console.log('activating service worker');

    evt.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.filter(function (cacheName) {
                return cacheName !== CACHE;
            }).map(function (cacheName) {
                return caches.delete(cacheName);
            })
        );
    }));
});

self.addEventListener('fetch', function (evt) {
    
    // ignore resources such as pdfs
    // ignore AI & GA tracking scripts
    if (isResource(evt.request) || isTracking(evt.request)) {
        return;
    }

    // static resources, fetch from cache first
    if (shouldRetrieveFromCache(evt.request)) {
        evt.respondWith(
            caches.open(CACHE).then(function (cache) {
                return cache.match(evt.request).then(function (response) {
                    if (response) { return response; }

                    return fetch(evt.request)
                        .then(function (response) {
                            if (response.ok || response.type === 'opaque') {
                                return networkRequestSucceeded(evt, cache, response);
                            }

                            return response;
                        })
                        .catch(function () {
                            checkWhenOnline(true);
                        });
                });
            }));
        
        return;
    }
    
    // page requests, serve from network and then cache
    if (isRequestingPage(evt.request)) {
        evt.respondWith(
            caches.open(CACHE).then(function (cache) {
                return fetch(evt.request)
                    .then(function (response) { 
                        if (response.ok) {
                            return networkRequestSucceeded(evt, cache, response);
                        }
                        
                        return response;
                    })
                    .catch(function () { return networkRequestFailed(evt, cache); });
            })
        );
        
        return;
    }
    
    // otherwise make the request as normal
    evt.respondWith(
        fetch(evt.request)
            .then(function (response) { return response; })
            .catch(function (e) { 
                checkWhenOnline(true); 
                
                throw e;
            }));
});

self.addEventListener('message', function (evt) {
    if (evt.data.action === 'check-offline') {
        checkWhenOnline();

        return notifyClients({
            type: 'check-offline',
            value: isOffline
        });
    } else if (evt.data.action === 'skip-waiting') {
        self.skipWaiting();
    }
});

function networkRequestSucceeded(event, cache, response) {
    isOffline = false;
    if (isGetMethod(event.request)) {
        // cache the response
        cache.put(event.request, response.clone());
    }
    return response;
}

function networkRequestFailed(event, cache) {
    checkWhenOnline(true);
    return cache.match(event.request).then(function (response) {
        // the page has been found in the cache
        if (response) {
            return response;
        }

        // serve the offline page
        return cache.match(offlinePage).then(function (response) { return response; });
    });
}

function notifyClients(message) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) { client.postMessage(message); });
    });
}

function checkWhenOnlineRequest() {
    var url = location.origin + offlinePage;
    fetch(url)
        .then(function (response) {
            // request has succeeded, we're back online
            isOffline = false;
            isCheckingForOnline = false;
            notifyClients({
                type: 'check-offline',
                value: isOffline
            });

            console.log('Client is back online');
        })
        .catch(function () {
            // still offline, wait then check again
            setTimeout(checkWhenOnlineRequest, 5000);
        });
}

function checkWhenOnline(requestHasFailed) {
    if (requestHasFailed) {
        isOffline = true;
    }

    if (!isOffline || isCheckingForOnline) { return; }

    isCheckingForOnline = true;

    notifyClients({
        type: 'check-offline',
        value: isOffline
    });

    checkWhenOnlineRequest();

    console.log('Client is offline');
}