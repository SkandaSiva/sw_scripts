const CACHE = "pwa-v3";

const URLS_TO_CACHE = [
    '/offline'
];

const OFFLINE_URL = '/offline';

self.addEventListener('install', async (event) => {
    console.log('[Service Worker] Install');
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
		await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
    })());
});

self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
		event.respondWith((async () => {
			try {
				// First, try to use the navigation preload response if it's supported.
				const preloadResponse = await event.preloadResponse;
				if (preloadResponse) {
					return preloadResponse;
				}

				const networkResponse = await fetch(event.request);
				return networkResponse;
			} catch (error) {
				// catch is only triggered if an exception is thrown, which is likely
				// due to a network error.
				// If fetch() returns a valid HTTP response with a response code in
				// the 4xx or 5xx range, the catch() will NOT be called.
				console.log('Fetch failed; returning offline page instead.', error);

				const cache = await caches.open(CACHE);
				const cachedResponse = await cache.match(OFFLINE_URL);
				return cachedResponse;
			}
		})());
	}
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
		// Enable navigation preload if it's supported.
		// See https://developers.google.com/web/updates/2017/02/navigation-preload
		if ('navigationPreload' in self.registration) {
			await self.registration.navigationPreload.enable();
		}
	})());

	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
});