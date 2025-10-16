const CACHE_VERSION = 44;
const CURRENT_CACHE = `cache-amarstock-${CACHE_VERSION}`;
var CACHE_IGNORE = [".*localhost.*",".*facebook.*", ".*.addthis.com.*", ".*www.google.*", ".*moatads.com.*", ".*\.(pdf|docx|doc)",'/Account/*'].map(function (r) { return new RegExp(r); });
const cacheFiles = ['/Content/img/logo.png', '/', '/offline.htm', '/latest-share-price'];

self.addEventListener('activate', evt =>
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CURRENT_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    )
);

self.addEventListener('install', evt =>
    evt.waitUntil(
        caches.open(CURRENT_CACHE).then(cache => {
            return cache.addAll(cacheFiles);
        })
    )
);

function fetchedFromNetwork(request, response) {
    if (200 == response.status) {
        var cacheCopy = response.clone();
        caches
            .open(CURRENT_CACHE)
            .then(cache => cache.put(request, cacheCopy));
    } else if (500 <= response.status) {
        return fromCache(request);
    }
    return response;
}

const fromCache = request =>
    caches
        .open(CURRENT_CACHE)
        .then(cache =>
            cache
                .match(request)
                .then(matching => matching || cache.match('/offline.htm'))
        );

self.addEventListener('fetch', evt => {
    if (evt.request.method !== 'GET' || !(evt.request.url.indexOf('http') === 0) || CACHE_IGNORE.some(urlIncluded(evt.request.url))) {
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .then(response => fetchedFromNetwork(evt.request, response), () => fromCache(evt.request))
            .catch(() => fromCache(evt.request))
    );
});

function urlIncluded(url) {
    return function (condition) {
        return condition.test(url);
    }
}