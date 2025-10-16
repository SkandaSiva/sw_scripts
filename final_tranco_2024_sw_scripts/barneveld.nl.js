const version = '7e57cda33f7f2efbddcee5dee7bbeac6406d582c';
const scope       = '/';
const coreCacheName = version + '-core';
const pagesCacheName = version + '-pages';
const assetsCacheName = version + '-assets';

function fetchFromCache(request) {
    return caches.match(request).then(response => {
        if (!response) {
            throw Error(`${request.url} not found in cache`);
        }
        return response;
    });
}

function trimCache(cacheName, maxItems) {
    caches.open(cacheName).then(function(cache) {
        cache.keys().then(function(keys) {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(trimCache(cacheName, maxItems));
            }
        });
    });
}

function emptyResponse(request) {
    return new Response('',
        { headers: { 'Content-Type': 'text/plain' } }
    );
}

function offlineImage() {
    var offlineSVG = '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">'
        + '<title id="offline-title">Offline</title>'
        + '<g fill="none" fill-rule="evenodd">'
        + '<path fill="#D8D8D8" d="M0 0h400v300H0z"/>'
        + '<text fill="#c4541c" font-family="verdana" font-size="72" font-weight="bold">'
        + '<tspan x="93" y="172">offline</tspan>'
        + '</text></g></svg>';
    return new Response(offlineSVG,
        { headers: { 'Content-Type': 'image/svg+xml' } }
    );
}

function addToCache(cacheName, request, response) {
    caches.open(cacheName)
        .then( cache => cache.put(request, response) );
}

function isNavigateRequest(request) {
    return (request.mode === 'navigate' ||
        (request.method === 'GET' && request.headers.get('accept').includes('text/html')));
}

function readCoreCacheUrls() {
    return fetch('/cache-files.json').then(response => {
        return response.json().then(paths => {
            return paths.map(path => `${scope}${path}`);
        });
    });
}

function isImageRequest(request) {
    return (request.headers.get('Accept').indexOf('image') !== -1);
}

function isStaticAssetRequest(request) {
    let staticDestinations = ['font', 'style', 'script', 'manifest'];
    return staticDestinations.indexOf(request.destination) > -1;
}

function shouldCache(request) {
    let url = new URL(request.url),
        pathPattern = /^\/typo3\//;

    return ( url.pathname !== '/typo3' && !!(pathPattern.exec(url.pathname)) && request.method === 'GET' && url.origin === self.location.origin );
}

function isTYPO3BackendRequest(request) {
    let url = new URL(request.url),
        pathPattern = /(^\/typo3$|^\/typo3\/)/;

    return !!pathPattern.exec(url.pathname);
}

function isTypenumXhrRequest(request) {
    return request.url.match(/\?type=[0-9]+/);
}

function isExternalDomainRequest(request) {
    return request.url.indexOf(self.location.origin) !== 0;
}

function isIgnoredRequest(request) {
    let url = new URL(request.url);

    return [
        '/robots.txt',
        '/favicon.ico'
    ].indexOf(url.pathname) !== -1;
}

function populateOfflineCache() {
    caches.open(coreCacheName).then(cache => {
        return readCoreCacheUrls().then(files => {
            return cache.addAll(files);
        });
    });
}

self.addEventListener('message', event => {
    if (event.data.command === 'trimCaches') {
        trimCache(pagesCacheName, 40);
        trimCache(assetsCacheName, 100);
    }
    if (event.data.command === 'updateOfflineCache') {
        populateOfflineCache();
        caches.delete(pagesCacheName);
    }
});

self.addEventListener('install', event => {
    skipWaiting();
    populateOfflineCache();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheKeys => {
            var oldCacheKeys = cacheKeys.filter(key => {
                return (key.indexOf(version) !== 0);
            });
            var deletePromises = oldCacheKeys.map(oldKey => {
                return caches.delete(oldKey);
            });
            return Promise.all(deletePromises);
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    let request = event.request;

    if (isExternalDomainRequest(request) || isIgnoredRequest(request) || isTYPO3BackendRequest(request)) {
        if (navigator.onLine === false) {
            return emptyResponse(request);
        }
        event.respondWith(
            fetch(request)
        );
        return;
    }

    if (isNavigateRequest(request)) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        addToCache(pagesCacheName, request, response.clone());
                    }
                    return response;
                })
                .catch(() => fetchFromCache(request))
                .catch(() => caches.match(`${scope}offline.html`))
        );
    } else if (isImageRequest(request)) {
        event.respondWith(
            fetchFromCache(request)
                .catch(
                    () => fetch(request)
                        .then(response => {
                            if (response.ok) {
                                if (shouldCache(request)) {
                                    addToCache(assetsCacheName, request, response.clone());
                                }
                                return response;
                            }
                        })
                )
                .catch(() => offlineImage())
        );
    } else if (isStaticAssetRequest(request)) {
        event.respondWith(
            fetchFromCache(request)
                .catch(
                    () => fetch(request)
                        .then(response => {
                            if (response.ok) {
                                if (shouldCache(request)) {
                                    addToCache(assetsCacheName, request, response.clone());
                                }
                                return response;
                            }
                        })
                )
        );
    } else if (isTypenumXhrRequest(request)) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        addToCache(pagesCacheName, request, response.clone());
                    }
                    return response;
                })
                .catch(() => fetchFromCache(request))
        );
    } else {
        event.respondWith(
            fetch(request)
        );
    }
});
