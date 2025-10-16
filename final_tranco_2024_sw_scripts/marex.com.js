var cacheName = 'marex-1';
var filesToCache = [
	'/?pwa',
	'/wp-content/themes/marex/style.css',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				// Cache hit - return response
				if (response) {
					return response;
				}

				return fetch(event.request).then(
					function (response) {
						// Check if we received a valid response
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}

						var responseToCache = response.clone();

						if (
							responseToCache.url.search(".js") !== -1 ||
							responseToCache.url.search(".css") !== -1 ||
							responseToCache.url.search(".ttf") !== -1 ||
							responseToCache.url.search(".eot") !== -1 ||
							responseToCache.url.search(".woff") !== -1 ||
							responseToCache.url.search(".woff2") !== -1 ||
							// responseToCache.url.search(".svg") !== -1 ||
							responseToCache.url.search(".png") !== -1 ||
							responseToCache.url.search(".jpg") !== -1 ||
							responseToCache.url.search(".jpeg") !== -1
						) {
							// console.log('Caching:' + responseToCache.url);
							caches.open(cacheName).then(function (cache) {
								cache.put(event.request, responseToCache);
							});
						} else {
							// console.log('Not caching:' + responseToCache.url);
						}

						return response;
					}
				);
			})
	);
});

/**
 * Delete old caches
 * 
 */
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (existingCacheNames) {
			return Promise.all(
				existingCacheNames.filter(function (existingCacheName) {
					return (existingCacheName != cacheName);
				}).map(function (existingCacheName) {
					// console.log("Deleting: " + existingCacheName)
					return caches.delete(existingCacheName);
				})
			);
		})
	);
});
self.addEventListener('push', function (event) {
	return false;
})