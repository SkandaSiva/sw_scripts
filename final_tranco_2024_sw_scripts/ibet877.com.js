const CACHE_VERSION = 'V1';

// install
self.addEventListener('install', event => {
	console.log(`Service Worker ${CACHE_VERSION} installing...`);

	event.waitUntil(
		caches.open(CACHE_VERSION).then(cache => cache.add('/pwa.jsp'))
	);

	// Force the waiting service worker to become the active service worker.
	self.skipWaiting();
});

// activate
self.addEventListener('activate', event => {
	console.log(`Service Worker ${CACHE_VERSION} activated`);

	event.waitUntil(caches.keys()
		.then(cacheNames => {
			let promiseArr = cacheNames.map(item => {
				if (item !== CACHE_VERSION) {
					// Delete that cached file
					return caches.delete(item);
				}
			});
			return Promise.all(promiseArr);
		})
	)
	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
});

// fetch
self.addEventListener('fetch', (event) => {
	// Check if this is a navigation request
	if (event.request.mode === 'navigate') {
		// Open the cache
		event.respondWith(caches.open(CACHE_VERSION).then((cache) => {
			return cache.match(event.request).then((cachedResponse) => {
				if (cachedResponse) {
					return fetch(event.request).then((fetchedResponse) => {
						if (fetchedResponse.ok) {
							cache.put(event.request, fetchedResponse.clone());
							return fetchedResponse;
						} else {
							return cachedResponse;
						}
					});
				} else {
					return fetch(event.request);
				}
			});
		}));
	} else {
		return;
	}
})
