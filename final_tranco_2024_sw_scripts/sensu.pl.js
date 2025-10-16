self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open('shop-offline').then(function (cache){
			return cache.addAll([
				'/pwa-offline.html'
			]);
		})
	);
});

self.addEventListener('fetch', function(event){
	if (event.request.method == "GET"){
		event.respondWith(
			caches.match(event.request).then(function(response){
				return fetch(event.request);
			}).catch(function(error){
				return caches.match("/pwa-offline.html");
			})
		);
	}
});