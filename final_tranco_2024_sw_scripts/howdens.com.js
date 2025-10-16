'use strict';

const config = {
    namespace: 'howdens',
    staticCacheItems: []
};

function cacheName(key, opts) {
    return opts.namespace + '-' + key;
}

function addToCache(cacheKey, request, response) {
    let copy;

    if (response.ok) {
        copy = response.clone();

        caches.open(cacheKey).then(function(cache) {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache(event) {
    return caches.match(event.request).then(function(response) {
        if (!response) {
            throw Error(event.request.url + ' not found in cache');
        }

        return response;
    });
}

self.addEventListener('install', function(event) {
    function onInstall(event, opts) {
        return caches.open(cacheName('static', opts)).then(function(cache) {
            return cache.addAll(opts.staticCacheItems);
        });
    }

    event.waitUntil(onInstall(event, config).then(function() {
        return self.skipWaiting();
    }));
});

self.addEventListener('activate', function(event) {
    function onActivate(event, opts) {
        return caches.keys().then(function(cacheKeys) {
            const oldCacheKeys = cacheKeys.filter(function(key) {
                return !key.startsWith(opts.namespace + '-');
            }),
                deletePromises = oldCacheKeys.map(function(oldKey) {
                    return caches.delete(oldKey);
                });

            return Promise.all(deletePromises);
        });
    }

    event.waitUntil(onActivate(event, config).then(function() {
        return self.clients.claim();
    }));
});

self.addEventListener('fetch', function(event) {

    function shouldHandleFetch(event, opts) {
        const request = event.request,
            url = new URL(request.url),
            criteria = {
                notServiceWorker: !request.url.endsWith('/sw.js'), // don't cache the service worker file
                isGETRequest: request.method === 'GET', // must be a GET
                isFromMyOrigin: url.origin === self.location.origin // must be same origin (if using a CDN make sure these criteria are updated as required)
            },
            failingCriteria = Object.keys(criteria).filter(function(criteriaKey) {
                return !criteria[criteriaKey];
            });

        return !failingCriteria.length;
    }

    function onFetch(event, opts) {
        let request = event.request,
            acceptHeader = request.headers.get('Accept'),
            resourceType = 'static',
            cacheKey;

        // block sw caching when fetch occurs from `hwapi`
        if (request.url.indexOf('hwapi') !== -1) {
            return false;
        }

        // block sw caching from oaa
        if (request.referrer && request.referrer.indexOf('trade-account-application') !== -1) {
            return false;
        }

        if (acceptHeader.indexOf('text/html') !== -1 && request.url.indexOf('?useAjax=true') !== -1) {
            return false;
        }

        if (acceptHeader.indexOf('text/html') !== -1 || acceptHeader.indexOf('application/json') !== -1) {
            resourceType = 'content';
        }

        cacheKey = cacheName(resourceType, opts);

        if (resourceType === 'content') {
            // content is network-first
            event.respondWith(fetch(request).then((response) => {
                return addToCache(cacheKey, request, response);
            }).catch(function() {
                return fetchFromCache(event);
            }));
        } else {
            // everything else is cache-first and updated in the background
            event.respondWith(fetchFromCache(event).catch(function() {
                return fetch(request);
            }).then(function(response) {
                return addToCache(cacheKey, request, response);
            }));
        }
    }

    if (shouldHandleFetch(event, config)) {
        onFetch(event, config);
    }
});