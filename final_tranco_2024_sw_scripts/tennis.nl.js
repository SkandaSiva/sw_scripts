
var cache = 'knltb',
    version = '-1147164290000', //will be overwritten by ServiceWorkerHandler
    cacheName = cache + '-' + version,
    // The file to serve when in offline-mode.
    offline = '/offline.html',
    
    /*
     *  List of files to store in cache.
     * - Use absolute paths for local files.
     * - Paths should be identical to the ones in the HTML, incl. cache-bust etc.
     * - Make sure that external files are on a CORS-enabled server
     * - Don't include the protocol for external files.
     */

    filesToCache = ["/dist/fonts/MarselisWebPro-Bold.woff","/dist/fonts/MarselisWebPro-Black.woff","/dist/fonts/roboto-bold.woff2","/dist/fonts/roboto-regular.woff2","/dist/fonts/icomoon.woff2","/dist/main.bundle.js?v=-1147164290000","/dist/main.css?v=-1147164290000"]; //filled from ServiceWorkerHandler

    self.addEventListener('install', function (e) {
        self.skipWaiting();

        e.waitUntil(
            caches.open(cacheName).then(function (cacheEntry) {
                return cacheEntry.addAll(filesToCache);
            })
        );
    });


    self.addEventListener('activate', function (e) {
        e.waitUntil(
            caches.keys().then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    // remove old cached files
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                    return null;
                }));
            })
        );
        return self.clients.claim();
    });

    self.addEventListener('fetch', function (e) {
        var networked;
        function fetchedFromNetwork(response) {
            return response;
        }

        function unableToResolve() {
            return caches.match(offline);
        }

        // Only cache GET requests
        if (e.request.method !== 'GET') {
            return;
        }

        /*
         * Force the offline page to every navigate event.
         * Pages might otherwise be served from cache anyway.
         */

        if (e.request.mode === 'navigate'
        || (e.request.method === 'GET'
        && e.request.headers.get('accept').includes('text/html'))) {
            e.respondWith(
                fetch(e.request).catch(unableToResolve)
            );
        } else {
            e.respondWith(caches.match(e.request).then(function (cached) {
                /* 
                * Return cached responses immediately, and meanwhile pull a 
                * network response and store that in the cache.
                * https://ponyfoo.com/articles/progressive-networking-serviceworker
                */
               
                if (!cached) {
                    networked = fetch(e.request)
                    // We handle the network request with success and
                    // failure scenarios.
                    .then(fetchedFromNetwork, unableToResolve)
                    // We should catch errors on the fetchedFromNetwork
                    // handler as well.
                    .catch(unableToResolve);
                }

                /*
                 * We return the cached response immediately if there
                 * is one, and fall back to waiting on the network as usual.
                 */

                return cached || networked;
            })
        );
        }
});