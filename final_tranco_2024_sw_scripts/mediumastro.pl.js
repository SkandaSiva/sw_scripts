// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 2.5;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = './html/offline.html';

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			// Setting {cache: 'reload'} in the new request will ensure that the response
			// isn't fulfilled from the HTTP cache; i.e., it will be from the network.
			await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Enable navigation preload if it's supported.
			// See https://developers.google.com/web/updates/2017/02/navigation-preload
			if ('navigationPreload' in self.registration) {
				await self.registration.navigationPreload.enable();
			}
		})()
	);

	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	// We only want to call event.respondWith() if this is a navigation request
	// for an HTML page.
	if (event.request.mode === 'navigate') {
		event.respondWith(
			(async () => {
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

					const cache = await caches.open(CACHE_NAME);
					const cachedResponse = await cache.match(OFFLINE_URL);
					return cachedResponse;
				}
			})()
		);
	}

	// If our if() condition is false, then this fetch handler won't intercept the
	// request. If there are any other fetch handlers registered, they will get a
	// chance to call event.respondWith(). If no fetch handlers call
	// event.respondWith(), the request will be handled by the browser as if there
	// were no service worker involvement.
});

self.addEventListener('push', function (event) {
	const payload = event.data.json();
	event.waitUntil(
		fetch('/frontend/translations/json')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				const translations = data;
				return self.registration.showNotification(payload.title, {
					icon: payload.medium_thumb,
					body: payload.message_body != null ? payload.message_body : '',
					data: { url: payload.conversation_url },
					actions: [
						{
							title: translations.view_message,
							action: 'message-action',
						},
					],
				});
			})
	);
});

self.addEventListener('notificationclick', function (event) {
	fetch('/frontend/notifications/track_click')
		.then(function (response) {
			return response.json();
		})
		.then(function () {
			if (event.action === 'message-action') {
				clients.openWindow(event.notification.data.url);
			}
		});
});
