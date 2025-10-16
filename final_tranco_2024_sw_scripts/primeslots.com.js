const SW = {
	OFFLINE_PAGE: "offline-dummy.html",
	CACHE_NAME: null,
	HOST: ['www.primeapi.com']
};

// Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function (event) {
	const url = new URL(location);
	const gamesApi = url.searchParams.get('games_api');
	const v = url.searchParams.get('v');
	const brandCode = url.searchParams.get('brand_code');

	if (!gamesApi || !v || !brandCode) {
		console.error("Service worker missing params");
		return;
	}

	SW.CACHE_NAME = `${brandCode}.${v}`;
	SW.HOST.push(url.hostname);

	const gamesApiUrl = `${gamesApi}?brand_local_code=${brandCode}`;

	event.waitUntil(
		caches.open(SW.CACHE_NAME).then(function (cache) {
			return cache.addAll(
				[
					gamesApiUrl,
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

	event.respondWith(async function () {
		const networkResponsePromise = fetch(request);
		const cache = await caches.open(SW.CACHE_NAME);
		const cachedResponsePromise = await cache.match(request);

		event.waitUntil(async function () {
			const networkResponse = await networkResponsePromise;
			await cache.put(request, networkResponse.clone());
		}());

		return cachedResponsePromise || networkResponsePromise;
	}());
});

// Clean up caches other than current.
self.addEventListener('activate', event => {
	event.waitUntil(async function () {
		const cacheNames = await caches.keys();

		await Promise.all(
			cacheNames.filter((cacheName) => {
				const deleteThisCache = cacheName !== SW.CACHE_NAME;
				return deleteThisCache;
			}).map(cacheName => caches.delete(cacheName))
		)
	}());
});