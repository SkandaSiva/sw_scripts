var cacheVersion = 5;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};

const offlineUrl = '/static/offline/offline.html';

const filesToCache = [
  offlineUrl
];

const excludedUrls = [
  '.mp4',
  'ctfassets.net',
  'google-analytics.com'
]

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in currentCache.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  let expectedCacheNames = Object.keys(currentCache).map(function(key) {
    return currentCache[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names,
            // then delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


this.addEventListener('fetch', event => {
  var request = event.request;

  for (let index = 0; index < excludedUrls.length; index++) {
    const url = excludedUrls[index];
    
    if( request.url.indexOf(url) !== -1 ) {
      return;
    }    
  }


  /**
   * (request.mode === 'navigate'): doc
   * (request.mode === 'same-origin'): doc through Highway
   */
  if ( (request.mode === 'navigate') || (request.mode === 'same-origin')) { 
     event.respondWith(
      fetch(request).catch(function(error) {
        return caches.open(currentCache.offline).then(function(cache) {
          return cache.match(offlineUrl);
        });
      }) // end fetch
    ); // end respondWith

  } else {
    /**
     * (request.method === 'GET') && request.headers.get('accept').includes('* /*') ) : fonts
     */
    if ( (request.method === 'GET') && request.headers.get('accept') && request.headers.get('accept').includes('*/*') )  { 
      for (let index = 0; index < filesToCache.length; index++) {
        const url = filesToCache[index];
        
        if( request.url.indexOf(url) !== -1 ) {
          event.respondWith(
            fetch(request).catch(function(error) {
              return caches.open(currentCache.offline).then(function(cache) {
                return cache.match(url);
              });
            }) // end fetch
          ); // end respondWith        
        }    
      }
    }

  }

  // return;
});