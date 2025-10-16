var CACHE_NAME = 'dc-cache-v1';
var urlsToCache = [
    '/images/logo.png',
    '/images/bottomsquareone.jpg',
    '/images/bottomsquaretwo-2018.jpg',
    '/images/bottomsquarethree-2018.jpg',
    '/images/bottomsquarefour-2.jpg',
    '/images/2018/backtotop.svg',
    '/images/BBB_A-Plus_Web.png',
    '/offline.html'
];

self.addEventListener('install',
    function (event) {
        self.skipWaiting();
        if (!('caches' in self)) return;
        event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
                return cache.addAll(urlsToCache);
            })
        );
    });

self.addEventListener('fetch',
    function (event) {
        if(!navigator.onLine && event.request.url.indexOf('default.aspx') !== -1) {
            event.respondWith(showOfflineLanding(event));
        }
        else {
            try {

            } catch (err) {
                event.respondWith(pullFromCache(event));
            }
            
        }
    });

function showOfflineLanding(event) {
    return caches.match(new Request('offline.html'));
}

function pullFromCache(event) {
    //return caches.match(event.request).then((response) => {
    //    return response || fetch(event.request).then((response) => {
    //        return caches.open('version1').then((cache) => {
    //            cache.put(event.request, response.clone());
    //            return response;
    //        });
    //    });
    //});
    event.respondWith(caches.match(event.request).then(function(response) {
        return response || fetch(event.request).catch(function () { });
        })
    );
}

//self.addEventListener('activate',
//    (event) => {
//        event.waitUntil(
//            caches.keys().then((cacheKeys) => {
//                return Promise.all(
//                    cacheKeys.map((cacheKey) => {
//                        return caches.delete(CACHE_NAME);
//                    })
//                );
//            })
//        );
//    });