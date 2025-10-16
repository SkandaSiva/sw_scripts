const STATIC_CACHE_NAME = 'static-cache-v7';
const OFFLINE_CACHE_NAME = 'offline-cache-v8';
const static_re = /^https:\/\/bimeon\.date\/(ckeditor|css|images|js|favicon\.ico|ring\.mp3|ring\.ogg)[\/]?/;
const dynamic_re = /^https:\/\/bimeon\.date\/(ru|en)\/(changelogin|complaint|contact|dating|deletecorrespondence|deletemessage|deleteview|likes|login|logout|messages|myprofile|noaccess|offline|page_not_found|privacy-policy|profile|register|remember|rules|search|top|uncomplaint|unsubscribe|views)[\/]?/;
const urlsToStaticCache = [
  '/images/top.png',
  '/images/search.png',
  '/images/support.png',
  '/images/no_connect.png'
];
const urlsToOfflineCache = [
  '/empty.html',
  '/ru/offline',
  '/en/offline'
];
self.addEventListener('activate', function(event) {
	var cacheWhitelist = [STATIC_CACHE_NAME, OFFLINE_CACHE_NAME];
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToStaticCache);
		})
	);
	event.waitUntil(
		caches.open(OFFLINE_CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToOfflineCache);
		})
	);
});
self.addEventListener('push', function(event) {
	if (event.data) {
		var data = JSON.parse(event.data.text());
		var title = data.title || "Title of notification";
		var options = {
			body: data.message || "New notification on bimeon.date",
			icon: data.icon || '',
			lang: data.lang || "ru",
			requireInteraction: data.requireInteraction || true,
			renotify: data.renotify || true,
			tag: data.tag || null
		};
		var vibrate = data.vibrate || null;
		var silence_from = data.silence_from || 0;
		if (silence_from == 0) silence_from = 24;
		var silence_to = data.silence_to || 0;
		if (silence_to == 0) silence_to = 24;
		var date = new Date();
		var hours = date.getHours();
		if (hours == 0) hours = 24;
		if (((silence_to - silence_from) < 0 && (hours >= silence_from || hours < silence_to)) || ((silence_to - silence_from) > 0 && (hours >= silence_from && hours < silence_to))) {
		} else {
			options['vibrate'] = vibrate;
			event.waitUntil(self.registration.showNotification(title, options));
		}
	}
});
self.addEventListener('notificationclick', function(event) {
	var url;
	switch (event.notification.title) {
		case 'Вам прислали сообщение':
		case 'You received a new message': url = 'messages'; break;
		case 'Вашу страницу просмотрели':
		case 'New views on your page': url = 'views'; break;
		case 'Вам выразили симпатию':
		case 'Your photo got a like': url = 'likes'; break;
		default: url = 'messages';
	}
	url = '/'+event.notification.lang+'/'+url+'/';
	var re = new RegExp(url, 'g');
	event.notification.close();
	event.waitUntil(clients.matchAll({
		type: "window",
		includeUncontrolled: true
	}).then(function(clientList) {
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url.search(re) >= 0 && 'focus' in client) {
				return client.focus();
			}
		}
		return clients.openWindow(url).then(windowClient => windowClient ? windowClient.focus() : null);
	}));
});
self.addEventListener('fetch', function(event) {
	if (static_re.test(event.request.url)) {
		event.respondWith(caches.open(STATIC_CACHE_NAME).then((cache) => {
			return cache.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}
				return fetch(event.request).then((response) => {
					if(!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}
					var responseToCache = response.clone();
					cache.put(event.request, responseToCache);
					return response;
				});
			});
		}));
	} else {
		event.respondWith(fetch(event.request)
		.catch(() => {
			return caches.open(OFFLINE_CACHE_NAME)
			.then((cache) => {
				var l = dynamic_re.exec(event.request.url);
				if (l) {return cache.match('/'+l[1]+'/offline');}
				if (event.request.url=='https://bimeon.date' || event.request.url=='https://bimeon.date/') {
					return cache.match('/ru/offline');
				}
				return cache.match('/empty.html');
			});
		}));
	}
});
