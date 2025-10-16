// install trigger -> cache index.html
self.addEventListener('install', function(event) {
	var indexPage = new Request('./');
	event.waitUntil(
		fetch(indexPage).then(function(response) {
			return caches.open('offline').then(function(cache) {
				return cache.put(indexPage, response);
			});
		})
	);
});
// fetch trigger -> fetch from server, save to cache, if fail: serve from cache
self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).then(function(response) {
			return caches.open('offline').then(function(cache) {
				if (event.request.method == 'GET') {
					cache.put(event.request, response.clone());
				}
				return response;
			});
		}).catch(function (error) {
			return caches.open('offline').then(function(cache) {
				return cache.match(event.request);
			});
		})
	);
});
