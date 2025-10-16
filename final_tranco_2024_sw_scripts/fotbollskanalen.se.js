// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
// which are not implemented in Chrome 40.


//importScripts('serviceworker-cache-polyfill.js');

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.

var CACHE_VERSION = Date.now();
var CURRENT_CACHES = {
    prefetch: 'read-through' //'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function (event) {
    // All of these logging statements should be visible via the "Inspect" interface
    // for the relevant SW accessed via chrome://serviceworker-internals
    //console.log('Handling install event. Resources to prefetch:', urlsToPrefetch);

    /*event.waitUntil(
        prefetchUrls()
    );*/
});

var prefetchUrls = function () {
    caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
        Promise.all([
            fetch('/api/serviceworker/applicationFrameworkList')
        ]).then(function (values) {
            console.log(values);

            return values[0].json();
        }).then(function (urlsToPrefetch) {
            var cachePromises = urlsToPrefetch.map(function (urlToPrefetch) {
                // This constructs a new URL object using the service worker's script location as the base
                // for relative URLs.
                var url;
                try {
                    url = new URL(urlToPrefetch, location.protocol + '//' + location.host);
                } catch (e) {
                    console.error('Error generating url: ' + urlToPrefetch + ' baseurl: ' + location.protocol + '//' + location.host);
                }
                // Append a cache-bust=TIMESTAMP URL parameter to each URL's query string.
                // This is particularly important when precaching resources that are later used in the
                // fetch handler as responses directly, without consulting the network (i.e. cache-first).
                // If we were to get back a response from the HTTP browser cache for this precaching request
                // then that stale response would be used indefinitely, or at least until the next time
                // the service worker script changes triggering the install flow.
                var now = Date.now();
                url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

                // It's very important to use {mode: 'no-cors'} if there is any chance that
                // the resources being fetched are served off of a server that doesn't support
                // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
                // In this example, www.chromium.org doesn't support CORS, and the fetch()
                // would fail if the default mode of 'cors' was used for the fetch() request.
                // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
                // cross-origin hosts will always be opaque
                // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
                // and it is not possible to determine whether an opaque response represents a success or failure
                // (https://github.com/whatwg/fetch/issues/14).
                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error('request for ' + urlToPrefetch +
                            ' failed with status ' + response.statusText);
                    }

                    // Use the original URL without the cache-busting parameter as the key for cache.put().
                    console.log('fetching and caching url: ' + urlToPrefetch);
                    return cache.put(urlToPrefetch, response);
                }).catch(function (error) {
                    console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                });
            });

            return Promise.all(cachePromises).then(function () {
                console.log('Pre-fetching complete.');
            });
        });
    }).catch(function (error) {
        console.error('Pre-fetching failed:', error);
    });
}

self.addEventListener('activate', function (event) {
    //prefetchUrls();
    //setInterval(prefetchUrls, 10 * 60 * 1000);

    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

//self.addEventListener('fetch', function (event) {
//    event.respondWith(
//      caches.match(event.request)
//        .then(function (response) {
//            if (response) {
//                console.log('Cache hit - return response: ' + event.request);
//                return response;
//            }
//            console.log('Cache miss, fetching - return response: ' + event.request);
//            return fetch(event.request);
//        }
//      )
//    );
//});

var isLinkPulse = function (url) {
    return url.indexOf('pp.lp4.io/p?') > 0
}

var isGoogleAnalytics = function (url) {
    return url.indexOf('www.google-analytics.com/collect?v=1') > 0 && url.indexOf('t=pageview') > 0;
}

var getAndroidVersion = function (ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
};

self.addEventListener('fetch', function (event) {
    if (!isGoogleAnalytics(event.request.url) && !isLinkPulse(event.request.url)) {
        return false;
    }
    if (parseFloat(getAndroidVersion()) <= 6.0) {
        return false;
    }
    event.respondWith(
        caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                if (response) {
                    // If there is an entry in the cache for event.request, then response will be defined
                    // and we can just return it.
                    //console.log(' Found response in cache:', response);

                    return response;
                }

                // Otherwise, if there is no entry in the cache for event.request, response will be
                // undefined, and we need to fetch() the resource.
                //console.log(' No response for %s found in cache. ' +
                //    'About to fetch from network...', event.request.url);

                // We call .clone() on the request since we might use it in the call to cache.put() later on.
                // Both fetch() and cache.put() "consume" the request, so we need to make a copy.
                // (see https://fetch.spec.whatwg.org/#dom-request-clone)
                return fetch(event.request.clone()).then(async function (response) {
                    // Optional: add in extra conditions here, e.g. response.type == 'basic' to only cache
                    // responses from the same domain. See https://fetch.spec.whatwg.org/#concept-response-type

                    if (response.status < 400 && isLinkPulse(event.request.url)) {
                        const client = await clients.get(event.clientId);
                        if (!client) return;
                        client.postMessage({
                            msg: "lp",
                            url: event.request.url
                        });
                    }

                    if (response.status < 400 && isGoogleAnalytics(event.request.url)) {
                        const client = await clients.get(event.clientId);
                        if (!client) return;
                        client.postMessage({
                            msg: "ga",
                            url: event.request.url
                        });
                    }

                    //if (response.status < 400 && response.type === 'basic') {
                    // This avoids caching responses that we know are errors (i.e. HTTP status code of 4xx or 5xx).
                    // One limitation is that, for non-CORS requests, we get back a filtered opaque response
                    // (https://fetch.spec.whatwg.org/#concept-filtered-response-opaque) which will always have a
                    // .status of 0, regardless of whether the underlying HTTP call was successful. Since we're
                    // blindly caching those opaque responses, we run the risk of caching a transient error response.
                    //
                    // We need to call .clone() on the response object to save a copy of it to the cache.
                    // (https://fetch.spec.whatwg.org/#dom-request-clone)
                    //cache.put(event.request, response.clone());
                    //}

                    // Return the original response object, which will be used to fulfill the resource request.
                    return response;
                });
            }).catch(function (error) {
                // This catch() will handle exceptions that arise from the match() or fetch() operations.
                // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                // It will return a normal response object that has the appropriate error code set.
                console.error('  Read-through caching failed:', error);

                throw error;
            });
        })
    );
});
