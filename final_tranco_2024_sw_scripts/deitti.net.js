/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

// Version 0.2

'use strict';

const CACHE_NAME = 'dnet-cache';
const OFFLINE_VERSION = 3;
const OFFLINE_URL = "/error/offline.html";
const FILES_TO_CACHE = [
];

importScripts('https://static.deitticdn.net/js/localforage.min.js');

console.log('Started', self);

self.addEventListener('install', function(e) {
	e.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
		})()
	);
	self.skipWaiting();
	console.log('[ServiceWorker] Installed', e);
});

self.addEventListener('activate', function(e) {
	e.waitUntil(
		(async () => {
			if ("navigationPreload" in self.registration) {
				await self.registration.navigationPreload.enable();
			}
		})()
	);
	self.clients.claim();
	console.log('[ServiceWorker] Activated', e);
});

self.addEventListener('fetch', (e) => {
	console.log('[ServiceWorker] Fetch', e.request.url);
	if (e.request.mode === "navigate") {
		e.respondWith(
			(async () => {
				try {
					const preloadResponse = await e.preloadResponse;
					if (preloadResponse) {
						return preloadResponse;
					}
					const networkResponse = await fetch(e.request);
					return networkResponse;
				} catch (error) {
					console.log("Fetch failed; returning offline page instead.", error);
					const cache = await caches.open(CACHE_NAME);
					const cachedResponse = await cache.match(OFFLINE_URL);
					return cachedResponse;
				}
			})()
		);
	}
});

self.addEventListener('push', function(e) {
	console.log('Push message', e);

	var title = 'Uusi viesti';

	e.waitUntil(
		self.registration.showNotification(title, {
			'body': 'The Message',
			'icon': 'https://static.deitticdn.net/graphics/favicon/apple-touch-icon-120x120.png'
		})
	);
});

self.addEventListener('notificationclick', function(e) {
	console.log('Notification click: tag', e.notification.tag);
	// Android doesn't close the notification when you click it
	// See http://crbug.com/463146
	e.notification.close();
	var url = 'https://www.deitti.net';
	// Check if there's already a tab open with this URL.
	// If yes: focus on the tab.
	// If no: open a tab with the URL.
	e.waitUntil(
		clients.matchAll({
			type: 'window'
		})
		.then(function(windowClients) {
			console.log('WindowClients', windowClients);
			for (var i = 0; i < windowClients.length; i++) {
				var client = windowClients[i];
				console.log('WindowClient', client);
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(url);
			}
		})
	);
});
