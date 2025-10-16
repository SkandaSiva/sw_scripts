const CACHE_NAME = 'korektortekstu-1.0.87';

self.addEventListener('activate', event => {
	event['waitUntil'](
		caches.keys()
			.then(keys => {
				return Promise.all(
					keys.filter(k => !k.startsWith(CACHE_NAME)).map(k => caches.delete(k))
				)
			})
	);
});

self.addEventListener('fetch', event => {
	if (event['request'].method !== 'GET') {
		return;
	}

	let url = event['request'].url;

	if (!url.includes('www.korektortekstu.pl')) {
		return;
	}

	if (!url.endsWith('.woff') &&
		!url.endsWith('.woff2') &&
		!url.endsWith('.svg') &&
		!url.endsWith('.png') &&
		!url.endsWith('.jpg') &&
		!url.endsWith('.js') &&
		!url.endsWith('.css') &&
		!url.endsWith('.webp')) {
		return;
	}

	event['respondWith'](
		caches.match(event['request']).then(cachedResponse => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return caches.open(CACHE_NAME).then(cache => {
				return fetch(event['request']).then(response => {
					return cache.put(event['request'], response.clone()).then(() => response);
				});
			});
		})
	);
});
