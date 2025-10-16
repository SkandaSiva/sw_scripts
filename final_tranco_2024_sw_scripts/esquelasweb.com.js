const version   = "0.2.8";
const siteId    = '0Q44I20fWkWQ46W6gV2z5fM4';
const cacheName = 'vs-'+version+'-'+siteId;
const cacheWhitelist = [cacheName,'google-fonts-webfonts'];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
	   return cache.addAll(["https://www.esquelasweb.com/ext/svg/all/im-1632218829.svg"]);
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
 	
	
	