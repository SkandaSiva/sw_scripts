importScripts('./workbox-sw.js')

if (workbox) {
    workbox.setConfig({
        debug: false
    });

    caches && caches.keys().then(res => {
        if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].indexOf('workbox-precache-v2-https://coins.devmintserver.com/h5/') > -1) {
                    caches.delete(res[i])
                    break
                }
            }
        }
    })

    workbox.core.setCacheNameDetails({prefix: "coins"});

    self.__precacheManifest = [].concat(self.__precacheManifest || []);

    self.__precacheManifest = self.__precacheManifest.filter(list => {
        if (list.url !== '/h5/index.html' && list.url !== '/h5/service-worker.js') {
            return list
        }
    })

    if (workbox.precaching) {
        if (workbox.precaching.suppressWarnings && typeof workbox.precaching.suppressWarnings === 'function') {
            workbox.precaching.suppressWarnings();
        }
        if (workbox.precaching.precacheAndRoute && typeof workbox.precaching.precacheAndRoute === 'function') {
            workbox.precaching.precacheAndRoute(self.__precacheManifest, {
                directoryIndex: null
            });
        }
    }
    // install new service worker when ok, then reload page.
    self.addEventListener("message", msg => {
        if (msg.data.action == 'skipWaiting') {
            self.skipWaiting()
        }
    })

    self.addEventListener('activate', function () {
        console.log('sw Activated')
    });

    self.addEventListener('fetch', function (event) {
        if ( event.request.url.match('www.google-analytics.com') || event.request.url.match('www.googleoptimize.com') || event.request.url.match('https://coins.devmintserver.com/h5/?isPwa=true')) {
            return false
        }
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    // IMPORTANT:Clone the request. A request is a stream and
                    // can only be consumed once. Since we are consuming this
                    // once by cache and once by the browser for fetch, we need
                    // to clone the response.
                    var fetchRequest = event.request.clone();

                    return fetch(fetchRequest).then(
                        function (response) {
                            // Check if we received a valid response
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // IMPORTANT:Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            // caches.open(CACHE_NAME)
                            //     .then(function (cache) {
                            //         cache.put(event.request, responseToCache);
                            //     });
                            return response;
                        }
                    );
                })
        );
    });
}
