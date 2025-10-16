self.oninstall = function () {
	caches.open('fayePIv2').then(function (cache) {
		cache
			.addAll(['/', 'index.html'])
			.then(function () {
				console.log('cashed!');
			})
			.catch(function (err) {
				console.log('err', err);
			});
	});
};

self.onactivate = function (event) {
	event.waitUntil(
		// Get the list of cache names
		caches
			.keys()
			.then(function (cacheNames) {
				return Promise.all(
					// Map over all cache names
					cacheNames.map(function (cacheName) {
						// If the cache name does not match the current version, delete it
						if (cacheName !== 'fayePIv2') {
							console.log('Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						}
					}),
				);
			})
			.then(function () {
				console.log('Old caches cleared. Activated new version!');
				// After clearing old caches, take immediate control of the clients.
				return self.clients.claim();
			}),
	);
};

self.onfetch = function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			} else {
				return fetch(event.request);
			}
		}),
	);
};
