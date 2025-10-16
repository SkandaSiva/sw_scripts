/* WEB APP INSTALLATION */

const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function(event) {
	console.log('[ServiceWorker] Install');

	const CACHE_FILES = [
		'/offline.html',
	];

	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(CACHE_FILES);
		})
	);
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

self.addEventListener('fetch', function(event) {
	console.log('[Service Worker] Fetch', event.request.url);
	if (event.request.mode === 'navigate') {
		event.respondWith((async () => {
			try {
				const preloadResponse = await event.preloadResponse;
				if (preloadResponse) {
					return preloadResponse;
				}

				const networkResponse = await fetch(event.request);
				return networkResponse;
			} catch (error) {
				console.log('[Service Worker] Fetch failed; returning offline page instead.', error);

				const cache = await caches.open(CACHE_NAME);
				const cachedResponse = await cache.match(OFFLINE_URL);
				return cachedResponse;
			}
		})());
	}
});


/* PUSH NOTIFICATIONS EVENTS */

// Instant worker activation
self.addEventListener('install', evt => self.skipWaiting());

// Claim control instantly
self.addEventListener('activate', evt => self.clients.claim());

// Listening for push events
self.addEventListener('push', event => {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	const sendNotification = data => {

		let timestamp = Math.floor(Date.now());

		return self.registration.showNotification(data.title, {
			body: data.body,
			icon: data.icon,
			lang: data.lang,
			badge: data.badge + '?' + timestamp,
			timestamp: timestamp,
			data: {
				url: data.url
			}
		});
	};

	if (event.data) {
		const data = event.data.json();
		event.waitUntil(sendNotification(data));
	}
});

// Listening for click events
self.addEventListener('notificationclick', event => {
	console.log('[SW] Notification click Received.');
	let url = '/';

	if(event.notification) {
		if(event.notification.data) {
			url = event.notification.data.url;
		}
	}
	event.notification.close();

	event.waitUntil(clients.matchAll({
		type: 'window'
	}).then(clientList => {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url === self.registration.scope && 'focus' in client) {
				return client.focus();
			}
		}
		if (clients.openWindow) {
			return clients.openWindow(url);
		}
	}));
});