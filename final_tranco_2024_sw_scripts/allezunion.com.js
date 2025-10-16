//--------------------------------------------------MODE OFFLINE--------------------------------------------------------

'use strict';

// Our current cache and its contents.
var CACHE = {
	version: 'fa_pwa',
	resources: [
		'/?utm_source=pwa',
	]
};

// Install the service worker, adding all cache entries
this.addEventListener('install', function (event) {
	const cssFile = new URL(location).searchParams.get('css');
	event.waitUntil(
		caches.open(CACHE.version).then(function (cache) {
			//CACHE.resources.push('/'+cssFile);
			return cache.addAll(CACHE.resources);
		})
	);
});

// Handle a fetch request. If not fetched from cache, attempt to add to cache.
this.addEventListener('fetch', function (event) {
	if(!event.request.url.indexOf('/ads.txt') > 0 || event.request.url.indexOf('/chatbox/') > 0) {
		event.respondWith(
			fetch(event.request).catch(function () {
				return caches.match(event.request);
			})
		);
	}
});

// Activate service worker
this.addEventListener('activate', function (event) {
	// Remove all caches that aren't whitelisted
	var cacheWhitelist = [CACHE.version];
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (cacheWhitelist.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
});

//-------------------------------------------------PUSHS NOTIFICATIONS--------------------------------------------------
this.addEventListener('push', function (event) {

	if (!(this.Notification && this.Notification.permission === 'granted' && event.data)) {
		return;
	}

	let data = event.data.json();

	const title = data['title'];
	const options = {
		body: data['body'],
		icon: data['icon'],
		badge: data['badge'],
		data: {
			url: data['link']
		},
		renotify: true,
	};

	if (data['tag'] != undefined && data['tag'] != "") {
		options.tag = data['tag'];
	}

	if (data['image'] != undefined && data['image'] != "") {
		options.image = data['image'];
	}

	if (data['actions'] != undefined && data['actions'] != "") {
		options.actions = data['actions'];
	}

	if (data['unread'] != undefined && data['unread']>0){
		if (navigator.setAppBadge) {
			navigator.setAppBadge(data['unread']);
		}
	}

	const notificationPromise = this.registration.showNotification(title, options);
	event.waitUntil(notificationPromise);
});

this.addEventListener('notificationclick', function (event) {

	event.notification.close();

	if (event.notification.data && event.notification.data.url) {

		var click_url = event.notification.data.url;

		event.waitUntil(clients.matchAll({
			type: "window"
		}).then(function (clientList) {
			for (var i = 0; i < clientList.length; i++) {
				var client = clientList[i];
				if (client.url == click_url && 'focus' in client)
					return client.focus();
			}
			if (clients.openWindow) {
				return clients.openWindow(click_url);
			}

		}));
	} else {
		event.waitUntil(
			clients.openWindow("/")
		);
	}
});
//EOF