var CACHE_NAME = 'FN-cache-v1';
var urlsToCache = [
  '/offline.html',
  '/images/logo.png'
];
console.log('sw.js starting');

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('FN app installed');
  // Activate new sw if it waiting - we don't have complex versioning
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened FN cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  //if (isCrossOrigin(event.request)) {
  //  return;
  //}
  if (event.request.mode !== 'cors') {
    var url = new URL(event.request.url);
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) || (event.request.method === 'GET' && url.hostname == self.location.hostname && urlsToCache.indexOf(url.pathname) != -1)) {
	console.log('Handling fetch '+event.request.mode+' event for', event.request.url);
	event.respondWith(
	  // try to return untouched request from network first
	  fetch(event.request).catch(function(error) {
	    console.error('sw.js fetch "'+event.request.url+'" error: ', error);
	    // if it fails, try to return request from the cache
	    return caches.match(event.request.url).then(function(response) {
	      if (response) {
		console.log('Found response in cache:', response.url);
		return response;
	      }
	      // if not found in cache, only if this is a navigation request
	      if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
		console.log('Offline page from cache');
		return caches.match('/offline.html') || new Response('Not available offline', { headers: { 'Content-Type': 'text/html' }, });
	      }
	      return new Response("Network error happened", {"status" : 408, "headers" : {"Content-Type" : "text/plain"}});
	    });
	  })
	);
    }
  }
});

// TODO updating - delete cache files that are not in new list

