const cache_version = 6;
const offline_page = '/offline';
const cache_name = 'offline-' + cache_version;
const cacheFiles = ['/offline', '/images/logo.svg'];
self.addEventListener('install', function(e) {
	e.waitUntil(
		caches
			.open(cache_name)
			.then(function(cache) {
				return Promise.all(
					cacheFiles.map(function (url) {
						return cache.add(url).catch(function (reason) {
							return false;
						});
					})
				);
			})
			.catch((error) => {return false})
	)
});
self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cache_name) {return caches.delete(key)}
			}));
		})
	);
	return self.clients.claim();
});
self.addEventListener('fetch', function(e) {
	var requestURL = new URL(e.request.url);
	if (requestURL.origin == location.origin) {
		if (navigator.onLine) {
		} else {
			e.respondWith(
				caches.match(e.request).then(function(response) {
					if (response) {
						return response
					} else {
						throw Error('sw fetch: not in cache');
					}
				}).catch(function() {
					if (e.request.mode === 'navigate' || (e.request.method === 'GET' && e.request.headers.get('accept').includes('text/html'))) {
						return caches.match(offline_page);
					}
				})
			);
		}
	}
});