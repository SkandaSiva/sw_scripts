const version   = "0.2.8";
const siteId    = '3geXAR0LNhAg3SqtSc4oKEN9';
const cacheName = 'vs-'+version+'-'+siteId;
const cacheWhitelist = [cacheName,'google-fonts-webfonts'];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
	   return cache.addAll(["https://www.caminolebaniego.com/ext/svg/all/im-1729522105.svg"]);
    })
  );
});
	
self.addEventListener('activate', function(event) { 
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
 	
	
	