// Define consts for FS-SW-Workers
// ==================================================================

// Cache storage name
const HTML_CACHE_NAME = 'sm_html_cache';

// Caching duration of the items, 5 minutes
const CACHING_DURATION = 5 * 60;

// Verbose logging or not
const DEBUG = true;


// Installation event
// ==================================================================
self.addEventListener('install', event => event.waitUntil(installServiceWorker()));

async function installServiceWorker() {
    DEBUG && console.log("SiteLion Service Worker (loader) installation started.");
    self.skipWaiting();
}


// Activation event
// ==================================================================
// self.addEventListener('activate', function(event) {
//     event.waitUntil(self.clients.claim()); // Become available to all pages
// });

self.addEventListener('activate', event => event.waitUntil(activateSW()));

async function activateSW() {
    DEBUG && console.log('SiteLion Service Worker (loader) activation.');

    // Remove old version caches
    const cacheKeys = await caches.keys();
    cacheKeys.forEach(cacheKey => {
        if (cacheKey == HTML_CACHE_NAME ) {
            console.log('SiteLion old cache removed', cacheKey);
            caches.delete(cacheKey);
        }
    });

    self.clients.claim();
}


// On-Message event
// ==================================================================
self.addEventListener('message', function(event){

    if (event.data.action === "saveToCache")
    {
        event.waitUntil(
            caches.open(HTML_CACHE_NAME)
            .then(function(cache) {                

                var linkToCache = event.data.data;
                DEBUG && console.log('FC-SW-CacheLoader: url to cache - ', linkToCache);

                fetch(linkToCache).then(function(response) {

                    // If status code isn't 200, thow error
                    if (!response.ok) {
                        throw new TypeError(`Bad response status for url: ${linkToCache}`);
                    }

                    // Compute expires date from caching duration
                    const EXPIRES = new Date();
                    EXPIRES.setSeconds(
                        EXPIRES.getSeconds() + CACHING_DURATION,
                    );

                    // Recreate a Response object from scratch to put it in the cache, with the extra header for managing cache expiration.
                    const CACHED_RESPONSE_FIELDS = {
                        status: response.status,
                        statusText: response.statusText,
                        headers: { 'FC-SW-Cache-Expiration': EXPIRES.toUTCString() },
                    };
                    response.headers.forEach((v, k) => {
                        CACHED_RESPONSE_FIELDS.headers[k] = v;
                    });

                    DEBUG && console.log(`FC-SW-CacheLoader: Caching url ${linkToCache}, Cache will expire at ${EXPIRES}, Cache-Expiration is set to ${CACHING_DURATION}s`);

                    // Save modified response to cache
                    return cache.put(linkToCache, new Response(response.body, CACHED_RESPONSE_FIELDS));
                })
               
            })
            .catch(function(err){
                console.log('FC-SW-CacheLoader: caches.open() error! ', err);
            })
        );
    }

    event.ports[0].postMessage("FC-SW-CacheLoader: Link processed");
});