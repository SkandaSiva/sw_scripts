var cacheName = 'myCacheVersion';
var filesToCache = [
   '/',
   
]
//.map(url => new Request(url, {credentials: 'include'}));
;


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      //console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          //console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	var request=e.request;
	//console.log('[ServiceWorker] Fetch', e.request.url);
	
    e.respondWith(
		fetch(e.request)
	    .then(function(res){
		      return caches.open("dynamiccache")
			  .then(function(cache){
			    cache.put(e.request.url, res.clone());
				return res;
			 })
		 })
	 .catch(function(error){
		 return caches.match(e.request);			 
	 })
    )
});