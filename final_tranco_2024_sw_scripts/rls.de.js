'use strict';

/**
 * PWA auf Homescreen installieren
 */

var CACHE_NAME = 'rlspwa-cache-v0.0.1';
var urlsToCache = [];

self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener("fetch", event => {
	// This is a dummy event listener
	// just to pass the PWA installation criteria on 
	// some browsers
});

/**
 * PWA Push Notifications
 */

var fallback_notification_url = "https://www.rls.de/";

self.addEventListener('push', function (event) {
	if (!event.data || !(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	var data = {};
	if (event.data) {
		data = event.data.json();
	}
	var title = data.title || "";
	var message = data.msg || "";
	var image = data.image || "";
	var url = data.url || null;

	var options = {
		body: message,
		image: image,
		data: {
			url: url
		}
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	var url = fallback_notification_url;
	if (event.notification.data && event.notification.data.url) {
		url = event.notification.data.url;
	}
	event.waitUntil(clients.openWindow(url));
});
