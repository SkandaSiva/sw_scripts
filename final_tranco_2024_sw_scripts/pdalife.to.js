importScripts('https://www.gstatic.com/firebasejs/7.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.3.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
	apiKey: "AIzaSyCB7flIepNnBhS_yWCNLVxPA2tt1g73haU",
	projectId: "pdaliferu-181721",
	messagingSenderId: "1042003035815",
	appId: "1:1042003035815:web:1fff8755b94b72e5747d82"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// [background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
	//console.log('Received background message ', JSON.stringify(payload, null, 2));
	return self.registration.showNotification(payload.data.title, payload.data);
});

self.addEventListener('notificationclick', function(event)
{
	//console.log(event);
	const target = event.notification.data || '/';
	event.notification.close();

	// This looks to see if the current is already open and focuses if it is
	event.waitUntil(
		clients.matchAll({
			type: 'window',
			includeUncontrolled: true
		}).then(function(clientList) {
			// clientList always is empty?!
			for (var i = 0; i < clientList.length; i++) {
				var client = clientList[i];
				if (client.url === target && 'focus' in client) {
					return client.focus();
				}
			}

			if (clients.openWindow) {
				return clients.openWindow(target);
			}
		})
	);
});


const dev = false;

var log = function(arg)
{
	if (dev) {
		console.info(arg);
	}
};

const workerVersion = dev ? Math.floor((Math.random() * 100) + 1) : '2.3';

var cacheName = 'pdalife-cache_' + workerVersion;
var urlsToCache = [
	'/',
	'/default/images/design/blank.gif',
	'/default/images/design/blank_long.gif',
	'/default/images/design/monster.svg',
	'/default/images/design/monster-attention.svg',
	'/default/images/design/monster-ban.svg',
	'/default/images/design/monster-popup.svg',
	'/default/images/design/monster-robot.svg',
	'./offline.html'
];

for (var i = 1; i < 15; i++) {
	urlsToCache.push('/default/images/avatars/th_'+i+'.png');
	urlsToCache.push('/default/images/avatars/'+i+'.png');
}

self.addEventListener('install', function(event)
{
	log('Install service worker version: ' + workerVersion);
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(urlsToCache);
		}).then(function() {
			return self.skipWaiting();
		})

	);
});

self.addEventListener('activate', function(event)
{
	log('Activate service worker version: ' + workerVersion);
	var cacheWhitelist = [cacheName];
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(name) {
					return cacheWhitelist.indexOf(name) === -1
				}).map(function(name) {
					log('Removing Old Cache: ' + name);
					return caches.delete(name);
				})
			);
		}).then(function() {
			return self.clients.claim();
		})
	);
});

self.addEventListener('fetch', function(event)
{
	var requestURL = new URL(event.request.url);
	// Routing for local URLs
	if (requestURL.origin === location.origin && event.request.method === 'GET' && !(/\/(cms|dwn|download|suggest|deals|my|t|check-login|check-email)(.*)$/.test(requestURL.pathname))) {
		// Handle main URL
		if (requestURL.pathname === '/') {
			event.respondWith(
				fetch(event.request).then(function (response) {
					log('Network request for: ' + event.request.url);
					return response;
				}).catch(function () {
					return caches.match('/offline.html');
				})
			);
		} else {
			event.respondWith(
				caches.match(event.request, {ignoreSearch: true}).then(function(response) {
					log((response ? 'Cache' : 'Network') + ' request for: ' + event.request.url);
					return response || fetch(event.request);
				}).catch(function() {
					return caches.match('/offline.html');
				})
			);
		}

		/*event.respondWith(
			caches.match(event.request/!*, {ignoreSearch: true}*!/).then(function(response) {
				log((response ? 'Cache' : 'Network') + ' request for: ' + event.request.url);
				return response || fetch(event.request).then(function(response) {
					return caches.open(cacheName).then(function(cache) {
						cache.put(event.request, response.clone());
						return response
					})
				});
			}).catch(function() {
				return caches.match('/offline.html');
			})
		);*/
	}
});

self.addEventListener('message', function(event)
{
	log('SW got message: ' + event.data.command);
	switch (event.data.command) {
		case 'resetCache':
			// reload users Cache
			caches.open(cacheName).then(function(cache) {
				log('Cache Reloaded!');
				return cache.addAll(urlsToCache);
			});
			break;
	}
});
