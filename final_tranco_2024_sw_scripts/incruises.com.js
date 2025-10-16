// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = 'pwabuilder-page';

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = 'ToDo-replace-this-name.html';

self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('install', async event => {
	event.waitUntil(caches.open(CACHE).then(cache => cache.add(offlineFallbackPage)));
});

if (workbox.navigationPreload.isSupported()) {
	workbox.navigationPreload.enable();
}

self.addEventListener('fetch', event => {
	if (event.request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const preloadResp = await event.preloadResponse;

					if (preloadResp) {
						return preloadResp;
					}

					const networkResp = await fetch(event.request);
					return networkResp;
				} catch (error) {
					const cache = await caches.open(CACHE);
					const cachedResp = await cache.match(offlineFallbackPage);
					return cachedResp;
				}
			})()
		);
	}
});

self.addEventListener('push', async function(event) {
	const payload = event.data ? event.data.json() : null;
	if (!payload) {
		console.log('No payload');
		return;
	}

	let options;
	if (payload.data.type === 'inchat') {
		options = {
			body: payload.notification.body.messageClean,
			icon: 'images/pwa/icons/logo_pwa_96x96.png',
			data: { url: payload.data.url }
		};
	} else {
		options = {
			body: payload.notification.body,
			icon: 'images/pwa/icons/logo_pwa_96x96.png',
			data: { url: payload.data.url }
		};
	}

	try {
		await self.registration.showNotification(payload.notification.title, options);
	} catch (err) {
		console.error('Error showing notification:', err);
	}
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	const url = event.notification.data.url;
	if (url) {
		event.waitUntil(clients.openWindow(url));
	}
});
