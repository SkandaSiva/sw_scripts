const cacheName = 'avendoo-cache';

/* USE THIS TO DEFINE FILES TO ALWAYS CACHE*/
const appShellFiles = [];

// install and files to always be cached
self.addEventListener('install', (e) => {
	self.skipWaiting();
	
	console.log('Service worker istalled. PWA should be ready to install now.');
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		// console.log('[Service Worker] Caching all: app shell and content');
		await cache.addAll(appShellFiles);
	})());
});

// what caching strategy should be used?
// ! do nothing bc of user switch timing issue
self.addEventListener('fetch', doNothing);

/** caching strategies */

function doNothing(event) {
	// do nothing
}

// simple approach, no cache
function networkOnly(event) {
	event.respondWith(fetch(event.request));
}

// Shows cache content, but updates once new content is available
function cacheThenNetwork(event) {
	event.respondWith(
		caches.open(cacheName).then(async function(cache) {
			const response = await fetch(event.request).catch(function() {
				return caches.match(event.request);
			});

			if (response !== undefined && event.request.method !== 'POST' && event.request.method !== 'PUT') {
				cache.put(event.request, response.clone());
			}

			return response;
		})
	);
}

/** push notifs */

self.addEventListener('push', function(event) {
	console.log('Received push');
	if (Notification.permission == 'granted') {
		var jsonNotif = event.data.json();
		self.registration.showNotification(
			jsonNotif.title,
			{
				body: jsonNotif.body,
				icon: jsonNotif.icon,
				data: jsonNotif.data,
				vibrate: jsonNotif.vibrate,
				actions: jsonNotif.actions
			}
		);
	}
});

self.addEventListener('notificationclick', function(event) {
	console.log('clicked action: "' + event.action + '"');
	event.notification.close();
});

self.addEventListener('notificationclose', function(event) {
	console.log('notif closed');
});