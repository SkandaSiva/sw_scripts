const version   = "0.2.8";
const siteId    = '0DBGNa4yVjr11pJIJO2qmFbN';
const cacheName = 'vs-'+version+'-'+siteId;
const cacheWhitelist = [cacheName,'google-fonts-webfonts'];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
	   return cache.addAll(["https://www.elsoplao.es/ext/svg/all/im-1726752547.svg"]);
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
 	
	
	