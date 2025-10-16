var cacheName = 'TSARVAR-Offline';

self.addEventListener('install', function(event) {
    //console.log('[PWA] Install');
    /*var indexPage = new Request('/');
    event.waitUntil(
        fetch(indexPage).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
                return cache.put(indexPage, response);
            });
        })
    );*/
});

self.addEventListener('fetch', function(event) {
    //console.log('[PWA] Fetch');
    /*var updateCache = function(request){
        return caches.open(cacheName).then(function (cache) {
            return fetch(request.clone()).then(function (response) {
                return cache.put(request, response);
            });
        });
    };
    event.waitUntil(updateCache(event.request));
    event.respondWith(
        fetch(event.request).catch(function(error) {
            return caches.open(cacheName).then(function(cache) {
                return cache.match(event.request).then(function(matching) {
                    var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
                    return report;
                });
            });
        })
    );*/
});