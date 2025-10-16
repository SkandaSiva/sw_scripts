"use strict";
// incrementing VERSION will kick off the install event and force previously cached
// resources to be cached again.
var VERSION = 1;
var CURRENT_CACHE = {
    offline: "doogal-offline-v" + VERSION
};
self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(CURRENT_CACHE.offline));
});
function getHeaderTimestamp(cachedResponse) {
    var dateHeader = cachedResponse.headers.get("date");
    var parsedDate = new Date(dateHeader);
    var headerTime = parsedDate.getTime();
    // If the Date header was invalid for some reason, parsedDate.getTime()
    // will return NaN.
    if (isNaN(headerTime)) {
        return null;
    }
    return headerTime;
}
self.addEventListener("activate", function (event) {
    // delete all caches that aren't named in CURRENT_CACHE
    // while there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    var expectedCacheNames = Object.keys(CURRENT_CACHE).map(function (key) { return CURRENT_CACHE[key]; });
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
                // if this cache name isn't present in the array of "expected" cache names,
                // then delete it.
                return caches["delete"](cacheName);
            }
            else {
                // remove old entries
                var dateNow_1 = new Date().getTime();
                var oneWeek_1 = 1000 * 60 * 60 * 24 * 7;
                caches.open(cacheName).then(function (cache) {
                    cache.keys().then(function (keys) {
                        keys.forEach(function (request) {
                            cache.match(request).then(function (response) {
                                var dateInSeconds = getHeaderTimestamp(response);
                                if (dateInSeconds !== 0 && dateInSeconds != null && dateInSeconds + oneWeek_1 < dateNow_1) {
                                    return cache["delete"](request);
                                }
                            });
                        });
                    });
                });
            }
        }));
    }));
});
function getCached(req) {
    return caches.match(req).then(function (cachedResponse) {
        if (cachedResponse == null && req.mode === "navigate") {
            return new Response("<h1 style=\"font-family:Arial, sans-serif\">You are offline and the content has not been cached</h1>", {
                headers: new Headers({
                    "Content-Type": "text/html"
                })
            });
        }
        else {
            return cachedResponse;
        }
    }, function () {
        return new Response("The content could not be retrieved");
    });
}
self.addEventListener("fetch", function (event) {
    var url = event.request.url;
    if (url.indexOf("chrome-extension://") === 0) {
        return;
    }
    if (event.request.url.endsWith("ads.txt")) {
        return;
    }
    if (event.request.method !== "GET") {
        return;
    }
    event.respondWith(fetch(event.request).then(function (response) {
        var cacheResponse = response.clone();
        caches.open(CURRENT_CACHE.offline).then(function (cache) {
            if (cache != null) {
                cache.put(url, cacheResponse);
            }
        });
        return response;
    })["catch"](function () {
        // check the cache
        return getCached(event.request);
    }));
});
