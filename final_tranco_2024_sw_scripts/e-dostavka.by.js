const CURRENT_CACHES = {
	font: 'font-cache-v1',
	css: 'css-cache-v1',
	js: 'js-cache-v1',
	image: 'image-cache-v1',
};

self.addEventListener('install', () => {
	self.skipWaiting();
	console.log('Service Worker has been installed');
});

self.addEventListener('activate', (event) => {
	const expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
		return CURRENT_CACHES[key];
	});
	// Delete out of date caches
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (expectedCacheNames.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function (event) {
	//  console.log('Fetching:', event.request.url);
	event.respondWith(
		(async function () {
			const cachedResponse = await caches.match(event.request);
			if (cachedResponse) {
				// console.log("\tCached version found: " + event.request.url);
				return cachedResponse;
			} else {
				// console.log("\tGetting from the Internet:" + event.request.url);
				return await fetchAndCache(event.request);
			}
		})()
	);
});

function fetchAndCache(request) {
	return fetch(request)
		.then(function (response) {
			if (!response.ok) {
				return response;
			}

			const url = new URL(request.url);

			if (response.status < 400 && response.type === 'basic' && url.search.indexOf('mode=nocache') === -1) {
				let cur_cache;
				if (
					response.headers.get('content-type') &&
					response.headers.get('content-type').indexOf('application/javascript') >= 0
				) {
					cur_cache = CURRENT_CACHES.js;
				} else if (
					response.headers.get('content-type') &&
					response.headers.get('content-type').indexOf('text/css') >= 0
				) {
					cur_cache = CURRENT_CACHES.css;
				} else if (response.headers.get('content-type') && response.headers.get('content-type').indexOf('font') >= 0) {
					cur_cache = CURRENT_CACHES.font;
				} else if (response.headers.get('content-type') && response.headers.get('content-type').indexOf('image') >= 0) {
					cur_cache = CURRENT_CACHES.image;
				}

				if (cur_cache) {
					return caches.open(cur_cache).then(function (cache) {
						cache.put(request, response.clone());
						return response;
					});
				}
			}
			return response;
		})
		.catch(function () {
			// console.warn('service-worker', error);
		});
}
