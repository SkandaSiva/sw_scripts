(function () {
	'use strict';

	//version flag for updating
	let version = "v0.0.6";
	const offlinePages = [
		'/',
		'/me/',
		'/remembers/',
		'/saved/',
		'/read/',
		'/talks/',
		'/offline/'
	];

	//helper function for versioning cache names
	function cacheName(key) {
		return `${version}-${key}`;
	}

	self.addEventListener('install', event => {
		self.skipWaiting();
		event.waitUntil(
			caches.open(cacheName('static'))
			.then(cache => cache.addAll([
				'/images/headshot-transparent.png',
				'/images/hpi-cover.png',
				'/images/ird-cover-straight.png',
				'/images/smashing-book.png',
				'/images/wpdb-cover.png'
			].concat(offlinePages)))
		);
	});

	self.addEventListener('activate', event => {
		event.waitUntil(
			caches.keys().then(function (keyList) {
				return Promise.all(keyList.map(function (key) {
					if (key.indexOf(version) !== 0) {
						//version changed so let's evict old stuff
						return caches.delete(key);
					};
				}));
			})
		);
	});

	self.addEventListener('fetch', event => {
		let request = event.request,
			acceptHeader = request.headers.get('Accept'),
			url = new URL(request.url),
			cacheKey;

		// Ignore non-GET requests
		if (request.method !== 'GET') {
			return;
		}

		//ignore sandbox
		if (
			url.pathname.substring(0,8) === '/sandbox' ||
			url.hostname === 'slowfil.es'
		){
			return;
		}
		// if HTML, try network first
		if (acceptHeader.indexOf('text/html') !== -1) {
			event.respondWith(
				fetch(request)
				.then(function (response) {
					//network
					let copy = response.clone();
					// if our offline pages, store updated in static
					if (offlinePages.includes(url.pathname)) {
						try {
							caches.open(cacheName("static"))
							.then(function (cache) {
								cache.put(request, copy);
							});
						} catch (error) {
							console.log(error);
						}
					} else {
						// put in pages
						caches.open("pages")
						.then(function (cache) {
							cache.put(request, copy);
						});
					}

					return response;
				})
				.catch(function () {
					//cache
					return caches.match(request)
						.then(function (response) {
							return response || caches.match('/offline/');
						});
				})
			);
			return;
		}
		// for non-HTML requests, go right to cache
		if (acceptHeader.indexOf('text/html') === -1) {
			event.respondWith(
				caches.match(request)
				.then(function (response) {
					return response || fetch(request)
						.then(function (response) {
							//Going to the network
							// If image, let's store in cache
							if (acceptHeader.indexOf('image') !== -1 && response.type === 'basic') {
								let copy = response.clone();
								cacheKey = cacheName("static");

								caches.open(cacheKey)
									.then(function (cache) {
										cache.put(request, copy);
									});
							}
							return response;
						})
				})
			)
		}
	})
}());