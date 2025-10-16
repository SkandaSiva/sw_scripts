/* eslint-disable */
// Caches
var version = self.location.search.split('v=')[1] || '1.1.0'
var CURRENT_CACHES = {
  svg: 'svg-cache-v' + version,
  font: 'font-cache-v' + version,
  css:'css-cache-v' + version,
  js:'js-cache-v' + version,
  api:'api-cache-v' + version
};


self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete out of date caches
  event.waitUntil(
      caches.keys().then(function(cacheNames) {
          return Promise.all(
              cacheNames.map(function(cacheName) {
                  return caches.delete(cacheName);
              })
          );
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(async function() {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {        
      return await fetchAndCache(event.request);
    }
  }());
});

function fetchAndCache(request) {
  return fetch(request)
  .then(function(response) {
    if (!response.ok) {
      return response;
    }
    
    var url = new URL(request.url);
    if (response.status < 400 && response.type === 'basic' && url.search.indexOf("mode=nocache") == -1) {
      var cur_cache;
      if (response.headers.get('content-type') && 
        response.headers.get('content-type').indexOf("application/javascript") >= 0) {
        cur_cache = CURRENT_CACHES.js;
      } else if (response.headers.get('content-type') && 
            response.headers.get('content-type').indexOf("text/css") >= 0) {
        cur_cache = CURRENT_CACHES.css;
      } else if (response.headers.get('content-type') && 
            response.headers.get('content-type').indexOf("font") >= 0) {
        cur_cache = CURRENT_CACHES.font;
      } else 
      if (response.headers.get('content-type') && response.headers.get('content-type').indexOf("svg+xml")>=0) {
        cur_cache = CURRENT_CACHES.svg;
      }

      if (response.headers.get('content-type') && 
            response.headers.get('content-type').indexOf("application/json") >= 0 &&
            url.search.indexOf("mode=cache") !== -1       
      ) {
        cur_cache = CURRENT_CACHES.api;
      }
      if (cur_cache) {
        return caches.open(cur_cache).then(function(cache) {
          cache.put(request, response.clone());
          return response;
        });
      }
    }
    return response;
  })
  .catch(function(error) {
    throw error;
  });
}