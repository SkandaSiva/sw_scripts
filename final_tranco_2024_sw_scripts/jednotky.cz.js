var CACHE_NAME = 'units-cache-v48';
var urlsToCache = [
 '/'
];

//self.importScripts('/resources/js/analytics-helper.js');


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      //sendAnalyticsEvent('pwa', 'install')
  );
});
self.addEventListener('fetch', function(event) {
	  event.respondWith(
	    caches.match(event.request).then(function(resp) {
	      // if it's not in the cache, serve the regular network request. And save it to the cache
	      return resp || fetch(event.request).then(function(response) {
	        return caches.open(CACHE_NAME).then(function(cache) {
	          cache.put(event.request, response.clone())
	          return response
	        })
	      })
	    })
	  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
        	if (CACHE_NAME !== cacheName && cacheName.startsWith("units-cache")) {
                return caches.delete(cacheName);
              }
        })
      );
    })
    //sendAnalyticsEvent('pwa', 'activate')
  );
}); 