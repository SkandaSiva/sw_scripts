// Install a service worker
self.addEventListener('install', event => {
	// Perform install steps
	event.waitUntil(
		caches.open('Pasino').then(cache => {
			console.log('Opened cache');
			return cache.addAll(['/']);
		})
	);
});

// Cache and return requests
self.addEventListener('fetch', () => {});

// Update a service worker
self.addEventListener('activate', event => {
	const cacheWhitelist = ['Pasino'];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
					return undefined;
				})
			);
		})
	);
});
