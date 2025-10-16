// the cache version gets updated every time there is a new deployment
const PACKAGE_VERSION = '1.1.162';
const CURRENT_CACHE = `cache-for-${PACKAGE_VERSION.replace(/['"]+/g, '')}`;

// these are the routes we are going to cache for offline support
const cacheFiles = ['./', './casino', './live-casino', './virtual-sport', './virtual-betting'];

/**
 * Installation takes place. An install event is always the first one sent to a service worker
 * (this can be used to start the process of populating an IndexedDB, and caching site assets).
 * During this step, the application is preparing to make everything available for use offline.
 * When the install handler completes, the service worker is considered installed.
 * At this point a previous version of the service worker may be active and controlling open pages.
 * Because we don't want two different versions of the same service worker running at the same time,
 * the new version is not yet active
 */
self.addEventListener('install', (event) =>
    event.waitUntil(
        caches.open(CURRENT_CACHE).then((cache) => {
            return cache.addAll(cacheFiles);
        }),
    ),
);

/**
 * Once all pages controlled by the old version of the service worker have closed,
 * it's safe to retire the old version, and the newly installed service worker receives an activate event.
 * The primary use of activate is to clean up resources used in previous versions of the service worker.
 * The new service worker can call skipWaiting() to ask to be activated immediately without waiting
 * for open pages to be closed. The new service worker will then receive activate immediately,
 * and will take over any open pages
 */
self.addEventListener('activate', (event) => {
    return event.waitUntil(
        // on activation we clean up the previously registered service workers
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CURRENT_CACHE) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});

/**
 *
 */
self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// // Cache the current page to make it available for offline
const update = (request) =>
    caches.open(CURRENT_CACHE).then((cache) => fetch(request).then((response) => cache.put(request, response)));

// Fetch the resource from the network
const fromNetwork = (request, timeout) =>
    new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
            // update(request);
        }, reject);
    });

// Fetch the resource from the browser cache
const fromCache = (request) =>
    caches.open(CURRENT_CACHE).then((cache) => cache.match(request).then((matching) => matching || cache.match('./')));

/**
 * General strategy when making a request (eg if online try to fetch it
 * From the network with a timeout, if something fails serve from cache)
 */
self.addEventListener('fetch', (event) => {
    //event.waitUntil(update(event.request));

    /**
     * Caching Strategy - Network First, Then Cache
     */
    //event.respondWith(fromNetwork(event.request, 10000).catch(() => fromCache(event.request)));

    /**
     * Caching Strategy - Network Only
     */
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.error('Failed to fetch:', error);
                // You can return a custom response here if needed
            }),
    );
});
