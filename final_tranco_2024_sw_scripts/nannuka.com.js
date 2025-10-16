'use strict';
const offlineUrl = './errors/error_online/offline.html';
const version = 'v1.29::';
const staticCacheName = version + 'static';
const pagesCacheName = 'pages';
const imagesCacheName = 'images';
const maxPages = 50; // Maximum number of pages to cache
const maxImages = 100; // Maximum number of images to cache
const timeout = 2000; // Number of milliseconds before timing out
var offlineMode = false;
const cacheList = [
    staticCacheName,
    pagesCacheName,
    imagesCacheName
];

function updateStaticCache() {
    return caches.open(staticCacheName)
    .then( cache => {
        // These items won't block the installation of the Service Worker
        cache.addAll([
            './',
            './favicon.ico',
            './media/img/nannuka/logo.png',
            './favicon.png',
            './themes/main/css/jquery.cookiebar.css?v=1',
            './media/js/jquery/ui.min.js'
        ]);
        // These items must be cached for the Service Worker to complete installation
        return cache.addAll([
            './media/js/jquery/jquery.min.js',
            './media/js/modernizr.min.js',
            './themes/main/css/bootstrap.min.css',
            offlineUrl
        ]);
    });
}

// Remove caches whose name is no longer valid
function clearOldCaches() {
    return caches.keys()
    .then( keys => {
        return Promise.all(keys
            .filter(key => !cacheList.includes(key))
            .map(key => caches.delete(key))
        );
    });
}

function stashInCache(request, response, cacheName, maxItems) {
    caches.open(cacheName)
    .then( cache => {
        cache.put(request, response);
        // Trim the cache if necessary
        cache.keys()
        .then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]);
            }
        });
    });
}

addEventListener('install', event => {
    event.waitUntil(
        updateStaticCache()
        .then( () => {
          skipWaiting();
        })
    );
});

addEventListener('activate', event => {
    event.waitUntil(
        clearOldCaches()
        .then( () => {
            clients.claim()
        })
    );
});

addEventListener('fetch', event => {
    const request = event.request;

    // Ignore requests to some directories
    if (request.url.includes('/cms')) {
        return;
    }
    if (request.url.includes('/admin')) {
        return;
    }
    if (request.url.includes('/wp-admin')) {
        return;
    }
    if (request.url.includes('/gateway')) {
        return;
    }

    if (request.url.includes('googletagmanager')) {
        return;
    }

    if (request.url.includes('parent/editmypost')) {
        return;
    }

    if (request.url.includes('parent/postit/new')) {
        return;
    }

    if (request.url.includes('professional/profile')) {
        return;
    }

    if (request.url.includes('parent/profile')) {
        return;
    }

    if (request.url.includes('facebook')) {
        return;
    }

    // Ignore non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // For HTML requests, try the network first, fall back to the cache, finally the offline page
    if (request.headers.get('Accept').includes('text/html')) {
        const fetchPromise = fetch(request);
        const cachePromise = caches.match(request);
        event.respondWith(
            new Promise( resolveWithResponse => {

                const timer = setTimeout( () => {
                    // Time out: CACHE
                    cachePromise
                    .then( responseFromCache => {
                        if (responseFromCache) {
                            resolveWithResponse(responseFromCache);
                        }
                    });
                }, timeout);

                fetchPromise
                .then( responseFromFetch => {
                    // NETWORK
                    clearTimeout(timer);
                    const copy = responseFromFetch.clone();
                    // Stash a copy of this page in the pages cache
                    try {
                        event.waitUntil(
                            stashInCache(request, copy, pagesCacheName, maxPages)
                        );
                    } catch (error) {
                        //console.error(error);
                    }
                    resolveWithResponse(responseFromFetch);
                })
                .catch( fetchError => {
                    clearTimeout(timer);
                    console.error(fetchError);
                    // CACHE or FALLBACK
                    cachePromise
                    .then( responseFromCache => {
                        resolveWithResponse(
                            responseFromCache || caches.match(offlineUrl)
                        );
                    });
                });

            })
        );
        return;
    }

    // For non-HTML requests, look in the cache first, fall back to the network
    event.respondWith(
        caches.match(request)
        .then(responseFromCache => {
            // CACHE
            return responseFromCache || fetch(request)
            .then( responseFromFetch => {
                // NETWORK
                // If the request is for an image, stash a copy of this image in the images cache
                if (request.url.match(/\.(jpe?g|png|gif|svg|mapbox)/)) {
                    const copy = responseFromFetch.clone();
                    try {
                        event.waitUntil(
                            stashInCache(request, copy, imagesCacheName, maxImages)
                        );
                    } catch (error) {
                        console.error(error);
                    }
                }
                return responseFromFetch;
            })
            .catch( fetchError => {
                console.error(fetchError);
                // FALLBACK
                // show an offline placeholder
                if (request.url.match(/\.(jpe?g|png|gif|svg|mapbox)/)) {
                    return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}});
                }
            });
        })
    );
});









this.addEventListener('message', function(event) {
    var data = event.data;

    if (data.command === "oneWayCommunication") {
        console.log("Message from the Page : ", data.message);
    }

    if (data.command === 'offline') {
        offlineMode = true;
    }
    if (data.command === 'online') {
        offlineMode = false;
    }
    if (data.command === "broadcast") {
        console.log("Broadcasting to the clients");

        this.clients.matchAll().then(function(clients) {
            clients.forEach(function(client) {
                client.postMessage({
                    "command": "broadcastOnRequest",
                    "message": "This is a broadcast on request from the SW"
                });
            });
        });
    }

});


/**
 * Clean up cache every 6 hours. Delete everything older than 3 days.
 * @return {undefined}
 */
setInterval(function () {

    caches.open(staticCacheName).then(function (cache) {
        cache.keys().then(function (keys) {
            keys.forEach(function (request, index, array) {


                cache.match(request).then(function (response) {

                    const date = new Date(response.headers.get('date'));
                    // if cached file is older than 3 days
                    if (Date.now() > (date.getTime() + (1000 * 60 * 60 * 24 * 3))) {
                        cache.delete(request);

                    }


                });


            });
        });
    });

    caches.open(pagesCacheName).then(function (cache) {
        cache.keys().then(function (keys) {
            keys.forEach(function (request, index, array) {


                cache.match(request).then(function (response) {

                    const date = new Date(response.headers.get('date'));
                    // if cached file is older than 3 days
                    if (Date.now() > (date.getTime() + (1000 * 60 * 60 * 24 * 3))) {
                        cache.delete(request);

                    }


                });


            });
        });
    });

    caches.open(imagesCacheName).then(function (cache) {
        cache.keys().then(function (keys) {
            keys.forEach(function (request, index, array) {


                cache.match(request).then(function (response) {

                    const date = new Date(response.headers.get('date'));
                    // if cached file is older than 3 days
                    if (Date.now() > (date.getTime() + (1000 * 60 * 60 * 24 * 3))) {
                        cache.delete(request);

                    }


                });


            });
        });
    });



}, 60 * 1000 * 60 * 6); // 60 * 1000 milsec