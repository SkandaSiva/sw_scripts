'use strict';

const SW_CACHE_NAME = 'static-cache-v1';
const SW_FILES_TO_CACHE = [
  'offline.html',
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(SW_CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Pre-caching offline page');
			return cache.addAll(SW_FILES_TO_CACHE);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== SW_CACHE_NAME) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.mode !== 'navigate') {
		// Not a page navigation, bail.
		return;
	}
	event.respondWith(
		fetch(event.request)
			.catch(() => {
			  return caches.open(SW_CACHE_NAME)
				.then((cache) => {
					return cache.match('offline.html');
				});
			})
	);
});

self.addEventListener('notificationclick', function(event) {
	if (Notification.prototype.hasOwnProperty('data')) {
		var url = event.notification.data.url;
		event.waitUntil(clients.openWindow(url));
	} else {
		event.waitUntil(getIdb().get(KEY_VALUE_STORE_NAME,
		event.notification.tag).then(function(url) {
			// At the moment you cannot open third party URL's, a simple trick
			// is to redirect to the desired URL from a URL on your domain
			var redirectUrl = '/redirect.html?redirect=' + url;
			return clients.openWindow(redirectUrl);
		}));
	}
	event.notification.close();
});

self.addEventListener('push', function(event) {
	var notificationData = event.data.json();
	var title = notificationData.title;
	var options = {
		body: notificationData.body,
		icon: 'assets/imgs/icons/icon120.png',
		vibrate: [500, 300, 100],
		tag: notificationData.tag,
		data: {
			url: notificationData.url
		}
	};

	event.waitUntil(self.registration.showNotification(title, options));
});
