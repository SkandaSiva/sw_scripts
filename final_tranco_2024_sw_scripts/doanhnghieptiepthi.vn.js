// Core assets
let coreAssets = [];

// On install, cache core assets
self.addEventListener('install', function (event) {
	console.log('SW install:', event);
	self.skipWaiting();
	// Cache core assets
	event.waitUntil(caches.open('app').then(function (cache) {
		for (let asset of coreAssets) {
			cache.add(new Request(asset));
		}
		return cache;
	}));

});

self.addEventListener('activate', function(event) {
  console.log('SW activate:', event);
  event.waitUntil(clients.claim());
});

// Listen for request events
self.addEventListener('fetch', function (event) {

	// Get the request
	let request = event.request;


	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

	// HTML files
	// Network-first
	if (
		(
			//request.url.startsWith(self.location.origin) || 
			request.url.startsWith('https://adminplayer.sohatv.vn') ||
			request.url.startsWith('https://player.sohatv.vn') || 
			request.url.startsWith('https://ims.mediacdn.vn')
		) &&
		!request.url.startsWith(self.location.origin + '/sw.js') &&
		!request.url.startsWith(self.location.origin + '/manifest.json')
	) {
		console.log('sw html ', request.url);
		event.respondWith(
			fetch(request).then(function (response) {

				// Create a copy of the response and save it to the cache
				let copy = response.clone();
				event.waitUntil(caches.open('app').then(function (cache) {
					return cache.put(request, copy);
				}));

				// Return the response
				return response;

			}).catch(function (error) {

				// If there's no item in cache, respond with a fallback
				return caches.match(request).then(function (response) {
					return response || caches.match('/offline.html');
				});

			})
		);
	}

	// Static
	// Offline-first
	if (
		request.url.includes('https://static.contineljs.com/fonts/') ||
		request.url.includes('https://cdnstoremedia.com/adt/cpc/tvcads/files/images/') ||
		request.url.includes('https://static.mediacdn.vn')
	) {
		console.log('sw static ', request.url);
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Save a copy of it in cache
					let copy = response.clone();
					event.waitUntil(caches.open('app').then(function (cache) {
						return cache.put(request, copy);
					}));

					// Return the response
					return response;

				});
			})
		);
	}
});