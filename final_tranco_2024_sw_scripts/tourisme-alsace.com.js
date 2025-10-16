CACHE_NAME = 'v0.2.3';
CACHE_PAGE_NAME = 'page.'+CACHE_NAME;

var REGEX_ORIGIN = new RegExp('^https://(www|static).visit.alsace');
//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function(event) {
    event.waitUntil(preLoad());
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    if(cacheName != CACHE_NAME && cacheName != CACHE_PAGE_NAME){
                        return true;
                    }
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

var preLoad = function(){
    console.log('Preload 404 + Offline');
    return caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(['/offline/','/404/']);
    });
}


self.addEventListener('fetch', function(event) {
    // on ne cache pas les page dans wp-includes et wp-admin
    if (event.request.method !== 'GET' || !event.request.url.match(REGEX_ORIGIN) || event.request.url.match(/\/wp\-includes\//) || event.request.url.match(/\/wp\-admin\//)) {
        return;
    }

    event.respondWith(checkResponse(event.request).catch(function(code) {
      console.log('ICI LE CODE '+code);
        return returnFromCache(event.request,code)}
    ));
    event.waitUntil(addToCache(event.request));

});


var checkResponse = function(request){
    return new Promise(function(fulfill, reject) {
        fetch(request).then(function(response){
            if(response.status !== 404) {
                fulfill(response)
            }else if(response.status === 404){
              reject(404)
            } else {
              reject()
            }
        }, reject)
    });
};

var addToCache = function(request){
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

  if(request.url.match(/\/wp-content\//gi) || request.url.match(/\.(css|mp4|jpg|jpeg|png|json|js|php)$/gi)){
        return caches.open(CACHE_NAME).then(function (cache) {
            return fetch(request).then(function (response) {
                return cache.put(request, response);
            });
        });
    }
    return caches.open(CACHE_PAGE_NAME).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
};

var returnFromCache = function(request,code){
    return caches.match(request).then(function (matching) {
      console.log('REQUEST : ',request);
      console.log('CODE : ',code);
        if(!matching || matching.status == 404) {
            if(code && code == 404){
              console.log('ICI 404 DETECTE');
              return caches.match('/404/')
            }else{
              console.log('ICI OFFLINE DETECTE');
              return caches.match('/offline/')
            }
        } else {
          console.log('ICI MATCH DETECTE');
          return matching
        }
    });
};

