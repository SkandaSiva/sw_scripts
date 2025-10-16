/* eslint-disable no-restricted-globals */
const PRECACHE = 'precache-v3';
const RUNTIME = 'runtime-v3';

const PRECACHE_URLS = ['./'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(PRECACHE)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting()),
	);
});

self.addEventListener('activate', (event) => {
	const cachesToKeep = [PRECACHE, RUNTIME];
	event.waitUntil(
		caches.keys().then((keyList) =>
			Promise.all(
				keyList.map((key) => {
					if (!cachesToKeep.includes(key)) {
						return caches.delete(key);
					}
					return null;
				}),
			),
		),
	);
});

self.addEventListener('fetch', (event) => {
	const requestUrl = event.request.url;
	if (
		(requestUrl.includes('spectrocoin.com') && requestUrl.includes('_next')) ||
		requestUrl.includes('favicon')
	) {
		event.respondWith(
			caches.open(RUNTIME).then(async (cache) => {
				const cachedResponse = await cache.match(event.request);
				const fetchedResponse = fetch(event.request).then((networkResponse) => {
					cache.put(event.request, networkResponse.clone());

					return networkResponse;
				});
				return cachedResponse || fetchedResponse;
			}),
		);
	}
});
