/**
 * @cacheVersion { int or str }
 * ensures removing old cache and load updated resources
 * change if new resources needs to be loaded
 *
 * */
let cacheVersion = 4;


let cacheName = {
    offlinePage: 'pwabuilder-offline' + cacheVersion
};


let offlinePageUrl = 'offline.html';


const url = location.hostname;
// const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
// let domain = matches && matches[1];

//console.log("domena: ", url);

if (url !== null && (url === "www.doz.pl" || url === "doz.pl") ) {
    offlinePageUrl = 'default_offline.html';
} else if (url !== null && (url === "www.aptelia.pl" || url === "aptelia.pl") ){
    offlinePageUrl = 'aptelia_offline.html';
}



//open new cache
self.addEventListener('install', function (event) {
    var offlinePage = new Request(offlinePageUrl);
    event.waitUntil(
        fetch(offlinePage).then(function (response) {
            return caches.open(cacheName.offlinePage).then(function (cache) {
                // console.log('[PWA Builder] Cached offline page during Install'+ response.url);
                return cache.put(offlinePage, response);
            });
        }));
});

//update cache if needed
self.addEventListener('activate', function (event) {
    var allCacheItems = Object.keys(cacheName).map(function (key) {
        return cacheName[key];
    });

    event.waitUntil(
        caches.keys().then(function (items) {
            return Promise.all(
                items.map(function (item) {
                    if (allCacheItems.indexOf(item) === -1) {
                        // console.log("Service worker deleteing cache item: ", item);
                        return caches.delete(item);
                    }
                })
            );
        })
    );
});

//fetch offline page
self.addEventListener('fetch', function (event) {
    if (event.request.mode == 'navigate') {
        event.respondWith(
            fetch(event.request).catch(function (error) {
                    //console.log('[PWA Builder] Network request Failed. Serving offline page ' + error );
                    return caches.open(cacheName.offlinePage).then(function (cache) {
                        return cache.match(offlinePageUrl);
                    });
                }
            )
        );
    }
});

self.addEventListener('refreshOffline', function (response) {
    return caches.open(cacheName.offlinePage).then(function (cache) {
        // console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
        return cache.put(offlinePage, response);
    });
});
