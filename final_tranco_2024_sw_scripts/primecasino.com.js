const SW = {
	OFFLINE_PAGE: "/static/offline-dummy.html",
	CACHE_NAME: null,
	HOST: ['www.primeapi.com', 'qa.primeapi.com']
};

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
	const url = new URL(location);
	const v = url.searchParams.get('v');
	const brandCode = url.searchParams.get('brand_code');

	if (!v || !brandCode) {
		console.error("Service worker missing params");
		return;
	}

	SW.CACHE_NAME = `${brandCode}.${v}`;
	SW.HOST.push(url.hostname);

	event.waitUntil(
		caches.open(SW.CACHE_NAME).then(function (cache) {
			return cache.addAll(
				[
					SW.OFFLINE_PAGE
				]
			);
		})
	);
});

self.addEventListener('fetch', function (event) {
	const { request } = event;
	const url = new URL(event.request.url);
	// Prevent Chrome Developer Tools error:
	// Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
	//
	// See also https://stackoverflow.com/a/49719964/1217468
	if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return;
	}

	if (request.method !== 'GET' || SW.HOST.indexOf(url.hostname) === -1 || url.pathname.startsWith('/son-api') || url.searchParams.get('no-cache') !== null) {
		return;
	}

	event.respondWith(caches.open(SW.CACHE_NAME).then((cache) => {
		// Respond with the image from the cache or from the network
		return cache.match(event.request).then((cachedResponse) => {
			return cachedResponse || fetch(event.request.url).then((fetchedResponse) => {
				// Add the network response to the cache for future visits.
				// Note: we need to make a copy of the response to save it in
				// the cache and use the original as the request response.
				cache.put(event.request, fetchedResponse.clone());

				// Return the network response
				return fetchedResponse;
			});
		});
	}));
});


self.addEventListener('activate', event => {
	// Clean up caches other than current.
	event.waitUntil(async function () {
		const cacheNames = await caches.keys();

		await Promise.all(
			cacheNames.filter((cacheName) => {
				const deleteThisCache = cacheName !== SW.CACHE_NAME;
				return deleteThisCache;
			}).map(cacheName => caches.delete(cacheName))
		);
	}());
});