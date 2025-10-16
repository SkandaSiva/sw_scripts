self.addEventListener('install', function (event) {
    console.log('installing service worker...', event);
});

const isFont = request => request.destination === 'font' || request.url.match(/.*\.(woff|woff2|ttf|otf|eot)\??[^\/]*$/i);
const isExternal = request => !request.url.startsWith(self.location.origin);
const isDebugFile =  request => request.url.match(/\/static\/debug\//g);
const isStyle = request => request.destination === 'style' || request.url.match(/.*\.css\??[^\/]*$/i);
const isCacheBustedFile = request => request.url.match(/cache-buster-\d*\//);

const CACHE_NAME = 'CACHE_NAME_V1';
self.addEventListener('fetch', function (event) {
    // console.log('requested', event.request.url);

    if (
        isDebugFile(event.request) ||
        isExternal(event.request) ||
        event.request.headers.get('range') //fix safari video loading bug https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
    ) {
        // don't handle those files -> use standard browser behavior
        return;
    }

    if (isFont(event.request)) {
        respondWithCacheAndNetworkFallback(event);
        return;
    }

    // css caching:
    // check if cache busted css
    if (isStyle(event.request) && isCacheBustedFile(event.request)) {
        // remove cache-buster-part
        let unbustedName = event.request.url.replace(/cache-buster-\d*\//, '');

        // respond with cache and update
        // todo: this could be improved:
        // -- check if the real file (same cache-buster-id) is already cached and then it doesn't need to be updated
        //    -> this could save a unnecessary request
        // -- delete old files (with other cache-buster-id than the real one)
        respondWithCacheAndUpdate(event, unbustedName);

        // set cookie to tell server that css is cached
        event.waitUntil(async function() {
            // Exit early if we don't have access to the client.
            // Eg, if it's cross-origin.
            if (!event.clientId) return;

            // Get the client.
            const client = await clients.get(event.clientId);
            // Exit early if we don't get the client.
            // Eg, if it closed.
            if (!client) return;

            // Send a message to the client.
            client.postMessage({
                eventName: 'setCookie',
                data: {name: 'inlinecss-loaded', value: 'true'}
            });

        }());

        return;
    }
});

//function cacheWithNetworkFallback(event) {
function respondWithCacheAndNetworkFallback(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    // console.log('found in cache', event.request.url);
                    return response;
                }

                return fetchAndUpdateCache(event);
            })
    );
}

// cacheName is the name which is looked for in the cache
function respondWithCacheAndUpdate(event, cacheName) {
    event.respondWith(
        caches.match(cacheName || event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    fetchAndUpdateCache(event, cacheName);

                    // console.log('found in cache', event.request.url);
                    return response;
                } else {
                    return fetchAndUpdateCache(event, cacheName);
                }
            })
    );
}

// cacheName is the name to be used for the file being put into the cache
function fetchAndUpdateCache(event, cacheName) {
    // IMPORTANT: Clone the request. A request is a stream and
    // can only be consumed once. Since we are consuming this
    // once by cache and once by the browser for fetch, we need
    // to clone the response.
    let fetchRequest = event.request.clone();

    // console.log('fetch from network ', fetchRequest.url);
    return fetch(fetchRequest).then(
        function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
                .then(function (cache) {
                    // console.log('put in cache', event.request.url);
                    cache.put(cacheName || event.request, responseToCache);
                });

            return response;
        }
    )
}

