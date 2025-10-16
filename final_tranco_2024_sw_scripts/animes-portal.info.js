// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 2;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			// Setting {cache: 'reload'} in the new request will ensure that the
			// response isn't fulfilled from the HTTP cache; i.e., it will be from
			// the network.
			await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
		})()
	);
	// Force the waiting service worker to become the active service worker.
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			// Enable navigation preload if it's supported.
			// See https://developers.google.com/web/updates/2017/02/navigation-preload
			if ("navigationPreload" in self.registration) {
				await self.registration.navigationPreload.enable();
			}
		})()
	);

	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// We only want to call event.respondWith() if this is a navigation request
	// for an HTML page.
	if (event.request.mode === "navigate") {
		event.respondWith(
			(async () => {
				try {
					// First, try to use the navigation preload response if it's supported.
					const preloadResponse = await event.preloadResponse;
					if (preloadResponse) {
						return preloadResponse;
					}

					// Always try the network first.
					const networkResponse = await fetch(event.request);
					return networkResponse;
				} catch (error) {
					// catch is only triggered if an exception is thrown, which is likely
					// due to a network error.
					// If fetch() returns a valid HTTP response with a response code in
					// the 4xx or 5xx range, the catch() will NOT be called.
					console.log("Fetch failed; returning offline page instead.", error);

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

// Handle push notification setup
self.addEventListener("push", (event) => {
	const { notif_icon, notif_image, notif_tag, notif_url, notif_title, notif_text, action_type, action_title } = event.data.json();
	let payload = {
		body: notif_text,
		icon: notif_image,
		tag: (notif_tag ? notif_tag : 'notice'),
		badge: notif_icon,
	};

	if (notif_image) {
		payload['image'] = notif_image;
	}

	if (notif_url) {
		payload['data'] = notif_url;
	}

	if (action_title) {
		// payload['actions'] = [{ action: action_type, title: action_title, icon: notif_icon }];
		payload['buttons'] = [{ action: action_type, title: action_title }];
	}

	// Call the method showNotification to show the notification
	event.waitUntil(self.registration.showNotification(notif_title, payload));
});

// Handle notification click event
self.addEventListener("notificationclick", (event) => {
	var open_link = (event.notification.data ? event.notification.data : (event.action !== undefined ? '/' : ''));

	event.notification.close();

	// Check event action type for different implementations
	switch (event.action) {

		// Just of example for custom actions, insted of just opening a page
		// case 'like':
			// fetch requiest for liking the item
		// break;

		// Defaults to opening a page (if url is provided)
		case 'url':

		// Handle Firefox undefined state since it does not support action buttons yet
		default:
			if (open_link) {
				event.waitUntil(
					clients
					.matchAll({ type: "window" })
					.then((clientList) => {
						for (const client of clientList) {
							console.log(client.url, open_link);
							if (client.url === open_link && "focus" in client) return client.focus();
						}
						if (clients.openWindow) return clients.openWindow(open_link);
					}),
				);
			}
		break;
	}
});

// Handle push subscribtion state change
self.addEventListener("pushsubscriptionchange", (event) => {
	console.log('pushsubscriptionchange');
	console.log(event);
});

// self.addEventListener('pushsubscriptionchange', function(event) {
// 	event.waitUntil(
// 		localforage.getItem('token')
// 		.then(function(token) {
// 		if (!token) {
// 			return;
// 		}

// 		localforage.getItem('machineId')
// 		.then(function(machineId) {
// 			return self.registration.pushManager.subscribe({ userVisibleOnly: true })
// 			.then(function(subscription) {
// 			var key = subscription.getKey ? subscription.getKey('p256dh') : '';

// 			return fetch('./updateRegistration', {
// 				method: 'post',
// 				headers: {
// 					'Content-type': 'application/json'
// 				},
// 				body: JSON.stringify({
// 				token: token,
// 				machineId: machineId,
// 				endpoint: subscription.endpoint,
// 				key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
// 				}),
// 			});
// 			});
// 		});
// 		})
// 	);
// });