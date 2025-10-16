importScripts("service-worker-cache-polyfill.js");
importScripts("service-worker.functions.js");

const THUNDERPICK_CACHE = "thunderpick";

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(removePreviousCache());
});

const removePreviousCache = () => onThunderpickCache().then(cache =>
    cache.keys().then(requests =>
        Promise.all(
            requests
                .map(cachedRequest => cache.delete(cachedRequest))
        )
    )
);

self.addEventListener("fetch", (event) => {
    const request = event.request.clone();

    if (isExternalOrApiOrExcludedRequest(request)) {
        event.respondWith(fetch(request))
        return;
    }

    if (isIndexRequest(request)) {
        event.respondWith(respondFromFetchOrCache(event));
        return;
    }

    if (isHashedFileRequest(request)) {
        event.respondWith(respondFromCacheOrFetch(event));
    }
});

const respondFromCacheOrFetch = (event, request, fallbackRequest) => {
    const requestToHandle = request || event.request;

    try {
        return onThunderpickCache()
            .then(cache => cache.match(requestToHandle.clone()))
            .then(response  => {
                if (response) {
                    return response;
                }
                return fetchAndCache(requestToHandle, fallbackRequest);
            });
    } catch (e) {
        console.error("Failed to respond from cache or fetch", e);

        return fetch(event.request);
    }
};

const respondFromFetchOrCache = (event) => {
    const requestToHandle = event.request;

    try {
        return fetchAndCache(requestToHandle.clone())
            .then(
                response => response,
                () => onThunderpickCache()
                    .then(cache => cache.match(requestToHandle))
            )
    } catch (e) {
        console.error("Failed to respond from fetch or cache", e);

        return fetch(event.request);
    }
};

const fetchAndCache = (request, fallbackRequest) => {
    return fetch(request.clone())
        .then(response => {
                return onThunderpickCache()
                    .then(cache =>
                        cache.put(request.clone(), response.clone())
                            .then(() => response)
                    )
            },
            (e) => {
                if (fallbackRequest) {
                    return fetch(fallbackRequest);
                }

                throw new Error(e);
            })
        .catch(e => {
            const {url, referrer} = request.clone();

            console.error(`Failed to fetch ${url} by ${referrer}`, e);
        });
};

const onThunderpickCache = () => {
    return self.caches.open(THUNDERPICK_CACHE)
};
