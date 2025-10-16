function pwaLogs(objDump) {
    if(console!==undefined && (typeof console)==="object") {
//        console.log(objDump);
    }
}

var pwaVersions = "4";
var onlinePwaStatus = true;

const querySearch = location.search;
const queryParams = new URLSearchParams(querySearch);

if(queryParams.has('pwa')===true) {
    pwaVersions = queryParams.get('pwa');
}

const CACHE_NAME    = "bi_" + pwaVersions;
const CACHE_OFFLINE = "bi_offline";
const offlinePage   = "courtesy.html";


var el = self;
    
if(el.addEventListener) {
    el.addEventListener("online", function () {
        onlinePwaStatus = true;
    });
    el.addEventListener("offline", function () {
        onlinePwaStatus = false;
    });
}
else if(el.attachEvent) {
    el.attachEvent("ononline", function () {
        onlinePwaStatus = true;
    });
    el.attachEvent("onoffline", function () {
        onlinePwaStatus = false;
    });
}
else {
    el.ononline = function () {
        onlinePwaStatus = true;
    };
    el.onoffline = function () {
        onlinePwaStatus = false;
    };
}

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open( CACHE_OFFLINE ).then(function(cacheOffline) {
            cacheOffline.add( offlinePage );
            caches.open( CACHE_NAME ).then(function(cache) {
                return cache.add(location.href).catch(function(reason) {
                    return pwaLogs("Alloy: "+ String(reason) +" "+ location.href);
                });
            })
        })  
    );
});

self.addEventListener("activate", function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    pwaLogs("Cache Key: "+key);
                    if(key!==CACHE_NAME && key!==CACHE_OFFLINE) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});



self.addEventListener("fetch", function(e) {
    
    if(new URL(e.request.url).origin !== location.origin) return;
    
    pwaLogs("onlinePwaStatus");
    pwaLogs(onlinePwaStatus);
    
    if(onlinePwaStatus===false) {
        pwaLogs("courtesy");
        
        e.respondWith(
            caches.open( CACHE_OFFLINE ).then(function(cache) {
                const cachedResponse = cache.match( offlinePage );
                if(cachedResponse) {
                    return cachedResponse;
                }
            })
        );
        return;
    }
    else if(e.request.mode==="navigate" && navigator.onLine) {
        e.respondWith(
            fetch(e.request).then(function(response) {
                return caches.open( CACHE_NAME ).then(function(cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
        );
        return;
    }
    else {
        
        pwaLogs("3 opzione");
        
    }

    if (e.request.method === 'GET' || e.request.method === 'get') {
        e.respondWith( caches.match(e.request).then(function(response) {
                return (
                    response ||
                    fetch(e.request).then(function(response) {
                        return caches.open( CACHE_NAME ).then(function(cache) {
                            cache.put(e.request, response.clone());
                            return response;
                        });
                    })
                );
            }).catch(function() {

                pwaLogs("Respond catch");

                caches.open( CACHE_OFFLINE ).then(function(cacheOffline) {
                    return cacheOffline.match( offlinePage );
                });
            })
        );
    } else {
        e.respondWith(fetch(e.request));
    }
});