const VERSION = "-0.0.8"

const CACHE = "bremerhaven-cache" + VERSION;
const DOCUMENTCACHE = "bremerhaven-document-cache" + VERSION;
const IMAGECACHE = "bremerhaven-image-cache" + VERSION;
const STYLECACHE = "bremerhaven-style-cache" + VERSION;
const SCRIPTCACHE = "bremerhaven-script-cache" + VERSION;
const FONTCACHE = "bremerhaven-font-cache" + VERSION;
const ADMINCACHE = "bremerhaven-admin-cache" + VERSION;
const OTHERCACHE = "bremerhaven-other-cache" + VERSION;

const offlineFallbackPage = "/pwa/offline.html";

const offlineFallbackPage_Resources = [
    "/img/logos/bremerhaven.gif",
    "/img/favicon.gif",
    "/sixcms/media.php/bhv2016.a.136.de/thumbnail_headerbild_breit/404.png",
    "/img/logos/ips-siegel.png",
    "/static/bhv2016.a.126.de/logo_normal/88x31.png",
    "/pwa/images/BREMERHAVEN-icon.svg",
    "/fonts/fira-sans/fira-sans-v8-greek-ext_latin_greek_latin-ext-300.woff2",
    "/fonts/fira-sans/fira-sans-v8-greek-ext_latin_greek_latin-ext-500.woff2",
    "/fonts/fira-sans/fira-sans-v8-greek-ext_latin_greek_latin-ext-700.woff2",
    "/fonts/fira-sans/fira-sans-v8-greek-ext_latin_greek_latin-ext-regular.woff2",

];


//Handels push requests from our server
self.addEventListener('push', function (e) {
    //console.log("recived push");
    const data = e.data.json();

    e.waitUntil(
        self.registration.showNotification(data.title, data.options)
    );
});

self.addEventListener('notificationclick', (e) => {
    console.log("clicked");
    e.notification.close();
    console.log(e.notification.data);
    e.waitUntil(clients.matchAll({type: 'window'}).then(clientsArr => {
        // If a Window tab matching the targeted URL already exists, focus that;
        const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === e.notification.data.url ? (windowClient.focus(), true) : false);
        // Otherwise, open a new tab to the applicable URL and focus it.
        if (!hadWindowToFocus) clients.openWindow(e.notification.data.url).then(windowClient => windowClient ? windowClient.focus() : null);

    }));
})

//Runs when the SW is first installed
self.addEventListener('install', function (e) {
    //console.log("service-worker install")
    e.waitUntil(
        //cache the Offline Page
        caches.open(CACHE).then(function (cache) {
            //add all files that should be cached
            return cache.addAll([
                "/pwa/manifest.webmanifest",
            ].concat(offlineFallbackPage, offlineFallbackPage_Resources));
        })
    );
});

//Runs after the first installation
self.addEventListener('activate', function (event) {
    console.log("service-worker activate")
    event.waitUntil(clients.claim());

    const cacheAllowlist = [CACHE, DOCUMENTCACHE, IMAGECACHE, STYLECACHE, SCRIPTCACHE, FONTCACHE, OTHERCACHE,ADMINCACHE];
    event.waitUntil(
        //cache the Offline Page
        caches.open(CACHE).then(function (cache) {
            //add all files that should be cached
            cache.addAll([
                "/pwa/manifest.webmanifest",
            ].concat(offlineFallbackPage, offlineFallbackPage_Resources));
        })
    );
    console.log("offline page stored");
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        //deletes old cache container
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Nachrichten aus der Webseite empfangen
self.addEventListener("message", (event) => {
    const client = event.source;
    if (event.data === "update") {

        self.skipWaiting()
            .then(() => console.log(event, "updated service-worker successfully"))
            .catch(e => console.error(e));

    }
});

//intercepts all network traffic
//https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook
self.addEventListener('fetch', async function (event) {

    if(/www.bremerhaven.de/.test(event.request.url) === false) {
        return false;
    }

    if(/\/sixcms\//.test(event.request.url)) {
        //await networkFirstCacheFallback(event, ADMINCACHE)
        return false;
    }

    if(/\/admin\//.test(event.request.url)) {
        //await networkFirstCacheFallback(event, ADMINCACHE)
        return false;
    }

    if(event.request.method === "POST") {
        //await networkFirstCacheFallback(event, ADMINCACHE)
        return false;
    }

    if(/\/politik\/service\//.test(event.request.url)) {
        return false;
    }

    if(/\/exporthandler\//.test(event.request.url)) {
        return false;
    }

    if(/\/internal\//.test(event.request.url)) {
        return false;
    }

    if(/\/infomonitor2/.test(event.request.url)) {
        return false;
    }

    if(/\/room-status.php/.test(event.request.url)) {
        return false;
    }

    if(/\/pwa\/api\//.test(event.request.url)) {
        return false;
    }

    if(/\/de\/.*\.127441\.html/.test(event.request.url)) {
        return false;
    }

    if(/[?|&]editmode=true/.test(event.request.url)) {
        //await networkFirstCacheFallback(event, ADMINCACHE)
        return false;
    }

    if (event.request.destination === "image") {
        await serveFromCacheAndUpdate(event, IMAGECACHE)
        return;
    }
    if (event.request.destination === "style") {
        await serveFromCache(event, STYLECACHE)
        return;
    }
    if (event.request.destination === "script") {
        await serveFromCache(event, SCRIPTCACHE)
        return;
    }
    if (event.request.destination === "font") {
        await serveFromCacheAndUpdate(event, FONTCACHE)
        return;
    }

    if (event.request.destination === "document") {
        await networkFirstCacheFallbackThenUpdate(event, DOCUMENTCACHE)
        return;
    }

    //Fallback should always be empty
    //console.log(event, "Other cache: " + event.request.destination)
    await networkFirstCacheFallback(event, OTHERCACHE)

});

async function networkFirstCacheFallbackThenUpdate(event, cacheName) {

    function fetchNewVersion(event, cacheName) {
        return fetch(event.request)
            .then( function (res) {
                return caches.open(cacheName)
                    .then(function (cache) {
                        cache.put(event.request, res.clone());
                        return res;
                    })
            })
            .catch(
                offlineFallback(event)
            );
    }

    function offlineFallback(event) {
        return caches.match(event.request)
            .then(
                function (cacheRes) {
                    if (cacheRes) {
                        return cacheRes;
                    } else {
                        return caches.match(offlineFallbackPage);
                    }
                }
            )
    }

    await event.waitUntil(
        await event.respondWith(
            fetch(event.request, {method: 'HEAD'})
                .then( headRes => {

                    if(headRes.hasOwnProperty("redirected")) {
                        if(headRes.redirected) {
                            return  cleanResponse(headRes);
                        }
                    }




                    return caches.match(event.request)
                        .then(
                            function (cacheRes) {
                                /*check if cache is valid*/
                                if(cacheRes) {
                                    /*compares version of cached file with header hash*/
                                    if(
                                        cacheRes.headers.get('etag') === headRes.headers.get('etag')
                                        || cacheRes.headers.get('etag') === ( headRes.headers.get('etag').slice(0, -1) + "-gzip\"" )
                                    ) {
                                        console.log("page served from cache")
                                        return cacheRes;
                                    } else {
                                        console.log("cache version old - page served from network")
                                        return fetchNewVersion(event, cacheName)
                                    }
                                } else {
                                    console.log("page served from network")
                                    return fetchNewVersion(event, cacheName)
                                }
                            }
                        )
                }).catch(() => {
                    console.log("user is offline")
                    return offlineFallback(event)
                }
            )
        )
    )
}

// cache first, fallback network
async function serveFromCache(event, cacheName) {
    await event.respondWith(
        caches.match(event.request)
            .then(await function (response) {
                if (response) {
                    return response;
                }

                // file not in cache, get from network and save in cache
                return fetch(event.request)
                    .then(function (res) {
                        return caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch( e => null );
            })
    );
}

// cache first, fallback network, update cache after
async function serveFromCacheAndUpdate(event, cacheName) {
    await event.respondWith(
        caches.match(event.request)
            .then(await function (response) {
                //if cached serve from cache and update cache after
                if (response) {
                    //updates the cache async
                    async function updateCache(event, cacheName) {
                        fetch(event.request)
                            .then(function (res) {
                                return caches.open(cacheName)
                                    .then(function (cache) {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch((e) => null);
                    }
                    updateCache(event, cacheName);

                    //return from cache without waiting for network
                    return response;
                }

                // file not in cache, get from network and save in cache
                return fetch(event.request)
                    .then(function (res) {
                        return caches.open(cacheName)
                            .then(function (cache) {
                                cache.put(event.request.url, res.clone());
                                return res;
                            })
                    });
            })
    );
}

// network first, fallback cache, update on connection
async function networkFirstCacheFallback(event, cacheName) {
    await event.waitUntil(
        await event.respondWith(
            fetch(event.request)
                .then(function (res) {
                    return caches.open(cacheName)
                        .then(function (cache) {
                            cache.put(event.request.url, res.clone());
                            return res;
                        })
                })
                .catch(function (e) {
                    return caches.match(event.request)
                        .then(
                            function (cacheRes) {
                                if (cacheRes) {
                                    return cacheRes;
                                }
                            }
                        )
                })
        )
    );
}
async function networkOnly(event, cacheName) {
    await event.waitUntil(
        await event.respondWith(
            fetch(event.request, {'credentials': 'same-origin'})
                .then(function (res) {
                    return res
                })
                .catch(function (e) {
                    return false
                })
        )
    );
}

function cleanResponse(response) {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = 'body' in clonedResponse ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then((body) => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        });
    });
}

var sendMsgToClient = async (evt, msg) => {
    const messageSource = evt.source;
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        if (client !== messageSource) {
            client.postMessage(msg);
        }
    }
}