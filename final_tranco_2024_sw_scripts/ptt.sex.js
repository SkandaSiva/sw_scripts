if (typeof caches !== 'undefined') {
	self.addEventListener('install', function(event) {
		event.waitUntil(
			caches.open('cache').then(function(cache) {
			return cache.addAll(
				["\/#pwa"]
			);
			})
		);
	});
	
	self.addEventListener('fetch', event => {
		if(!navigator.onLine){
			event.respondWith(
					caches.match(event.request).then(function(response) {
						return response;
					})
			);
		}else{
			event.respondWith(
				fetch(event.request).then(response => {
					return caches.open("cache").then(cache => {
						if(response.status=200){
							console.log("caching : "+response.url);
							cache.put(response.url,response.clone());
						}
						return response;
					});
				}).catch(function() {
					return caches.match(event.request);
				})
			);
		}
	});
}