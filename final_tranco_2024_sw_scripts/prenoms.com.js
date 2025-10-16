const CACHE_VERSION = "1.2.28";
const CACHE_NAME = "prenoms" + "." + CACHE_VERSION;
const PRECACHE_URLS = [ '/', '/offline' ];

// Default files to always cache
const isCacheable = function( url ){
  const urlObject = new URL(url);
  if( urlObject.hostname.match( new RegExp( 'prenoms.com', 'gm' ) ) !== null ){
   return true
  }
  return false;
};

self.addEventListener('install', function( event ){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll( PRECACHE_URLS )
                  .then(function(){ self.skipWaiting() });
    })
  );
});



self.addEventListener('activate', function( event ){
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return ( cacheName !== CACHE_NAME );
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function( event ){
  let neededResourceUrl = event.request.url;
  if (event.request.method !== 'GET') { return; }
  if (!isCacheable(neededResourceUrl)) { return; }
  if (!event.request.mode === 'navigate') { return; }
  event.respondWith(networkElseCache(event));
});

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  let neededResourceUrl = event.request.url;
  return fetch(event.request).then(function(networkResponse) {
    if( networkResponse ){
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, networkResponse);
      });
      return networkResponse.clone();
    }
    return CacheElseOfflineCache(event, networkResponse.clone());
  }).catch( function( err ){
    return CacheElseOfflineCache( event, err );
  });
}

function CacheElseOfflineCache (event, networkError ) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match(event.request).then(function(cachedResponse) {
      if( cachedResponse ){
        return cachedResponse;
      }
      return OfflineCacheElseNetworkError(event, networkResponse);
    }).catch(function() {
      return OfflineCacheElseNetworkError(event, networkError);
    });
  }).catch(function() {
    return OfflineCacheElseNetworkError(event, networkError);
  });
}

function OfflineCacheElseNetworkError (event, networkError) {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.match('/offline').then(function(offlineResponse) {
      return networkError;
    }).catch(function() {
      return networkError;
    });
  }).catch(function() {
    return networkError;
  });
}
