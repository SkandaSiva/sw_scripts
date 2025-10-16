const CACHE_STATIC_NAME = 'swr-static-cache';
const CACHE_DYNAMIC_NAME = 'swr-dynamic-cache';

const PREFIX = self.origin.includes('http://localhost') ? '/cms' : '';
const OFFLINE_PAGE = PREFIX + '/assets/swr/.html/offline.html';
const POLYFILLS = '/polyfill/v2/polyfill.min.js?flags=gated&rum=false&features=document,Array.prototype.forEach,Array.prototype.includes,CustomEvent,Navigator.prototype.geolocation,navigator.geolocation,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,NodeList.prototype.forEach,Object.entries,Object.values,URL,default,es6,Element.prototype.scrollIntoView';
// These files will be prefetched.
const STATIC_FILES = [
    OFFLINE_PAGE,
    POLYFILLS
];

// These files won't be cached.
const BLACK_LIST = [
    'hit.xiti',
    'tx.io',
    '?_pjax=',
    '/~webradio/',
    'www.linkedin.',
    '/ugc/',
    '/ugc?',
    '/public/',
    '/public?',
    '/secure/',
    '/secure?',
    '/system/servlet/captcha.servlet'
];

// These paths will use NETWORK_FIRST.
const NETWORK_FIRST_LIST = [
  '/api/',
  '/json/',
  '.json',
  '/rest/'
];

// Maximum items to keep in cache
const CACHE_ITEM_LIMIT = {
    [CACHE_DYNAMIC_NAME]: 200
};

// Available & implemented caching strategies
const STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    CACHE_ONLY: 'cache-only',
    NETWORK_FIRST: 'network-first',
    NETWORK_ONLY: 'network-only',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

/**
 * Prefetch static files for static cache.
 */
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                return cache.addAll(STATIC_FILES).catch(e => {
                    console.error(e);
                });
            })
    );
});

/**
 * Delete old caches.
 */
self.addEventListener('activate', event => {
    const cacheAllowlist = [CACHE_STATIC_NAME, CACHE_DYNAMIC_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cacheName => {
                if (cacheAllowlist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            }));
        })
    );
    return self.clients.claim();
});

/**
 * Recursively removes oldest item from cache, when cache has too many items.
 * @param cacheName
 * @param maxItems
 */
function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
        .then(function(cache) {
            return cache.keys()
                .then(function(keys) {
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(() => trimCache(cacheName, maxItems));
                    }
                });
        });
}

/**
 * Removes origin from url for requests on the same domain.
 * @param url
 * @returns {string}
 */
function createUrl(url) {
    let cachePath;
    if (url.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
        cachePath = url.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
        cachePath = url; // store the full request (for CDNs)
    }
    return cachePath;
}

/**
 * Checks for valid response and if resource is on blacklist.
 * @param res
 * @returns {boolean}
 */
function isCacheable(res) {
    if (!res || res.status > 399 || !(res.type === 'basic')) {
        return false;
    }
    return !isBlackListed(res.url);
}

/**
 * @param requestUrl
 * @returns {boolean}
 */
function isBlackListed(requestUrl) {
    return BLACK_LIST.findIndex(entry => requestUrl.includes(entry)) > -1;
}

/**
 * Checks if requested resource is a prefetched static file.
 * @param requestUrl
 * @returns {boolean}
 */
function isStaticFile(requestUrl) {
    // STATIC_FILES.findIndex(val => val === createUrl(event.request.url > -1))
    return STATIC_FILES.includes(requestUrl.slice(self.origin.length));
}

function isHTMLRequest(request) {
    return Boolean(request && request.headers && request.headers.get('accept') && request.headers.get('accept').includes('text/html'));
}

function isJSONRequest(request) {
  return Boolean(request && request.headers && request.headers.get('accept') && request.headers.get('accept').includes('application/json'));
}

function isNetworkFirstRequest(request) {
  return NETWORK_FIRST_LIST.findIndex(entry => request.url.includes(entry)) > -1 || isHTMLRequest(request)  || isJSONRequest(request);
}

/**
 * Puts response into cache
 * @param requestUrl
 * @param response
 * @param cacheResponse
 * @returns {Promise<Cache | void>}
 */
function handleCacheUpdate(requestUrl, response, cacheResponse) {
    // Determine cache name
    const cacheName = isStaticFile(requestUrl) ? CACHE_STATIC_NAME : CACHE_DYNAMIC_NAME;
    return caches.open(cacheName)
        .then(function(cache) {
            // Trim cache, when it has an item limit configured
            if (CACHE_ITEM_LIMIT[cacheName] !== undefined) {
                trimCache(cacheName, CACHE_ITEM_LIMIT[cacheName]);
            }
            if (cacheResponse && cacheResponse.url !== requestUrl) {
                cache.delete(cacheResponse.url, {ignoreSearch: true});
            }
            try {
                cache.put(createUrl(requestUrl), response.clone());
            } catch (e) {
                console.warn(e);
            }
            return response;
        }).catch(e => console.error(e));
}

/**
 * Returns prefetched offline page
 * @param event
 * @returns Response
 */
function handleOfflinePage(event) {
    // Only return offline.html for text/html requests
    if (!event || !isHTMLRequest(event.request)) {
        return new Response(null, {status: 404});
    }
    return caches.open(CACHE_STATIC_NAME)
        .then(function(cache) {
            return cache.match(OFFLINE_PAGE).then(function(cacheResponse) {
                    return cacheResponse !== undefined ? cacheResponse : new Response(null, {status: 404});
                }
            );
        });
}

/**
 * Checks if given strategy is part of STRATEGIES object
 * @param strategy
 * @returns {boolean}
 */
function isValidStrategy(strategy) {
    return Object.values(STRATEGIES).includes(strategy);
}

self.addEventListener('fetch', function(event) {
    // Skip request if it is not made with http request. Avoids error "Request scheme 'chrome-extension' is unsupported"
    if (!(event.request.url.indexOf('http') === 0) || isBlackListed(event.request.url) || event.request.method !== 'GET') {
        return;
    }

    /**
     * Handles fetch event and applies given caching strategy.
     * @param event
     * @param strategy
     * @returns {Promise<Response>|Promise<Response | undefined>}
     */
    function handleEventCaching(event, strategy) {
        if (!isValidStrategy(strategy)) {
            console.error(`Invalid strategy ${strategy}`);
            return;
        }
        // Simply fetch event.request for network-only strategy.
        if (strategy === STRATEGIES.NETWORK_ONLY) {
            return fetch(event.request);
        }

        return caches.match(event.request).then(cacheResponse => {
            // Return cache response, even if it is undefined for cache-only strategy
            if (strategy === STRATEGIES.CACHE_ONLY && !isBlackListed(event.request.url)) {
                return cacheResponse;
            }
            // Return cache response only if it exists for cache-first strategy
            if (strategy === STRATEGIES.CACHE_FIRST && cacheResponse !== undefined) {
                return cacheResponse;
            }
            // Remaining strategies (stale-while-revalidate, network-first & potentially cache-first) will attempt to fetch resource from network
            const fetchedResponse = fetch(event.request)
                .then(networkResponse => {
                    // Uncacheable responses will just be returned without applying a caching strategy
                    if (!isCacheable(networkResponse)) {
                        return networkResponse;
                    }
                    // Remaining strategies (stale-while-revalidate, network-first & potentially cache-first) update cache with fetched response.
                    return handleCacheUpdate(event.request.url, networkResponse, cacheResponse);
                }).catch(() => {
                    // Resource could not be fetched, return cache response if exists or offline fallback
                    return cacheResponse || handleOfflinePage(event);
                });
            // return cache response if it exists or fetched response for stale-while-revalidate strategy.
            if (strategy === STRATEGIES.STALE_WHILE_REVALIDATE) {
                return cacheResponse || fetchedResponse;
            }
            return fetchedResponse;
        });
    }

    if (isStaticFile(event.request.url)) {
        event.respondWith(
            handleEventCaching(event, STRATEGIES.CACHE_FIRST)
        );
    } else if (isNetworkFirstRequest(event.request)) {
        event.respondWith(
            handleEventCaching(event, STRATEGIES.NETWORK_FIRST)
        );
    } else {
        event.respondWith(
            handleEventCaching(event, STRATEGIES.STALE_WHILE_REVALIDATE)
        );
    }
});
