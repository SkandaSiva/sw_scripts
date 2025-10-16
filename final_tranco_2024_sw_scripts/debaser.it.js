//deve stare in root, a causa dello scope
///inzio della parte GESTIONE NOTIFICHE PUSH
self.addEventListener('notificationclick', function (e) {
    //Close the notificaiton
    //console.log(e);
    e.notification.close();

    //Focus or open webpage
    e.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == e.notification.data.url && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    return clients.openWindow(e.notification.data.url);
                }
            })
    );
});


self.addEventListener('push', function (event) {
    //console.log('push received');
    //console.log(event);

    //Set some no cache headers for retrieving the notification details
    var httpHeaders = new Headers();
    httpHeaders.append('pragma', 'no-cache');
    httpHeaders.append('cache-control', 'no-cache');

    var fetchInit = {
        method: 'GET',
        headers: httpHeaders,
    };

    var the_endpoint;
    //event.waitUntil(

    //registration.pushManager.getSubscription().then(function (subscription) {
    //    console.log("got subscription id: ", subscription.endpoint)
    //    the_endpoint = encodeURIComponent(subscription.endpoint);
    //})
    //    );


    //We wait for data fetch and notification promises
    event.waitUntil(
        registration.pushManager.getSubscription().then(function (subscription) {
            //console.log("got subscription id: ", subscription.endpoint)
            the_endpoint = encodeURIComponent(subscription.endpoint);
            fetch("https://www.debaser.it/ws/push/JsonMessage.aspx?endpoint=" + the_endpoint, fetchInit).then(function (res) {
                return res.json().then(function (notificationData) {
                    // Show notification
                    console.log(notificationData);
                    console.log('setting up notification');
                    

                    if (Notification.permission == 'granted') {
                        return self.registration.showNotification(notificationData.data.title, {
                            body: notificationData.data.body,
                            icon: notificationData.data.icon,
                            data: notificationData.data
                        });

                    }
                    else {
                        Notification.requestPermission(function (permission) {
                            if (permission == 'granted') {
                                return self.registration.showNotification(notificationData.data.title, {
                                    body: notificationData.data.body,
                                    icon: notificationData.data.icon,
                                    data: notificationData.data
                                });
                            }
                        });
                    }

                })
            })

        })



    );


});
///fine della parte GESTIONE NOTIFICHE PUSH




///inzio della parte GESTIONE OFFLINE E INSTALLABILITA' DELLA PWA
'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 7;
let CURRENT_CACHES = {
    offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = 'https://www.debaser.it/offline.html';

function createCacheBustedRequest(url) {
    //console.log('createCacheBustedRequest ' + url);
    let request = new Request(url, { cache: 'reload' });
    // See https://fetch.spec.whatwg.org/#concept-request-mode
    // This is not yet supported in Chrome as of M48, so we need to explicitly check to see
    // if the cache: 'reload' option had any effect.
    if ('cache' in request) {
        return request;
    }

    // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
    let bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
    return new Request(bustedUrl);
}

self.addEventListener('install', event => {
    //console.log('addEventListener install');
    event.waitUntil(
        // We can't use cache.add() here, since we want OFFLINE_URL to be the cache key, but
        // the actual URL we end up requesting might include a cache-busting parameter.
        fetch(createCacheBustedRequest(OFFLINE_URL)).then(function (response) {
            return caches.open(CURRENT_CACHES.offline).then(function (cache) {
                return cache.put(OFFLINE_URL, response);
            });
        })
    );
});

self.addEventListener('activate', event => {
    //console.log('addEventListener activate');
    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names,
                        // then delete it.
                        //console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

//self.addEventListener('fetch', event => {
//    //console.log('addEventListener fetch');
//    // We only want to call event.respondWith() if this is a navigation request
//    // for an HTML page.
//    // request.mode of 'navigate' is unfortunately not supported in Chrome
//    // versions older than 49, so we need to include a less precise fallback,
//    // which checks for a GET request with an Accept: text/html header.
//    if (event.request.mode === 'navigate' ||
//        (event.request.method === 'GET' &&
//            event.request.headers.get('accept').includes('text/html'))) {
//        console.log('Handling fetch event for', event.request.url);
//        event.respondWith(
//            fetch(event.request).catch(error => {
//                // The catch is only triggered if fetch() throws an exception, which will most likely
//                // happen due to the server being unreachable.
//                // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
//                // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
//                // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
//                console.log('Fetch failed; returning offline page instead.', error);

//                console.log('OFFLINE_URL: ' + OFFLINE_URL)

                
//                // A VOLTE VA IN ERRORE ANCHE SE È ONLINE, QUINDI DISABILITIAMO LA PAGINA DI CORTESIA 
//                // CHE DICE CHE SEI OFFLINE PERCHÈ IN REALTÀ IL PIÙ DELLE VOLTE NON LO SEI
//                //return caches.match(OFFLINE_URL);


//            })
//        );
//    }


//    // If our if() condition is false, then this fetch handler won't intercept the request.
//    // If there are any other fetch handlers registered, they will get a chance to call
//    // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
//    // handled by the browser as if there were no service worker involvement.
//});
///fine della parte GESTIONE OFFLINE








