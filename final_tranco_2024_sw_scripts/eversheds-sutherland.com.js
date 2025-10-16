"use strict";

var config = {
    staticCacheItems: []
};

function addToCache(cacheKey, request, response) {
    var copy;

    if (response && response.ok) {
        copy = response.clone();

        caches.open(cacheKey).then(function (cache) {
            cache.put(request, copy);
        });
    }
    return response;
}

function fetchFromCache(event) {
    return caches.match(event.request).then(function (response) {
        if (!response) {
            throw Error(event.request.url + " not found in cache");
        }

        return response;
    });
}

self.addEventListener("install", function (event) {
    function onInstall(opts) {
        return caches.open("static").then(function (cache) {
            return cache.addAll(opts.staticCacheItems);
        });
    }

    event.waitUntil(onInstall(config).then(function () {
        return self.skipWaiting();
    }));
});

self.addEventListener("fetch", function (fetchEvent) {

    function shouldHandleFetch(event) {
        var request = event.request;
        var url = new URL(request.url);
        var criteria = {
            notServiceWorker: !request.url.endsWith("/sw.js"), // Don't cache the service worker file
            isGETRequest: request.method === "GET", // Must be a GET
            isFromMyOrigin: url.origin === self.location.origin, // Must be same origin (if using a CDN make sure these criteria are updated as required)
            notAPIRequest: !url.pathname.includes("/api/") // Should not be an API call 
        };
        var failingCriteria = Object.keys(criteria).filter(function (criteriaKey) {
            return !criteria[criteriaKey];
        });

        return !failingCriteria.length;
    }

    function onFetch(event) {
        var request = event.request;
        var acceptHeader = request.headers.get("Accept");
        var rangeHeader = request.headers.get("Range");
        var resourceType = "static";

        if (request.url.indexOf("/jss/dictionary/") !== -1) {
            return;
        }

        if (acceptHeader.indexOf("text/html") !== -1 || acceptHeader.indexOf("application/json") !== -1 || rangeHeader) {
            resourceType = "content";
        }

        if (resourceType === "content") {
            // Content is network-first
            event.respondWith(fetch(request).then(function (response) {
                return addToCache(resourceType, request, response);
            }).catch(function () {
                return fetchFromCache(event);
            }));
        } else {
            // Everything else is cache-first and updated in the background
            event.respondWith(fetchFromCache(event).catch(function () {
                if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
                    return;
                }

                return fetch(request);
            }).then(function (response) {
                return addToCache(resourceType, request, response);
            }));
        }
    }

    if (shouldHandleFetch(fetchEvent)) {
        onFetch(fetchEvent);
    }
});
