'use strict';

const CACHE_NAME = '23';

const FILES_TO_CACHE = [
	'/offline.html',
];

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
		  return cache.addAll(FILES_TO_CACHE);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	evt.waitUntil(
		caches.keys().then((keyList) => {
		  return Promise.all(keyList.map((key) => {
			if (key !== CACHE_NAME) {
			  return caches.delete(key);
			}
		  }));
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	if (evt.request.mode !== 'navigate' || evt.request.cache === 'only-if-cached') {
	  return;
	}
	evt.respondWith(
		fetch(evt.request).catch(() => {
			  return caches.open(CACHE_NAME)
				  .then((cache) => {
					return cache.match('offline.html');
				  });
			})
	);
});

self.addEventListener('push', (evt) => {
	const performer = evt.data && evt.data.text();
	evt.waitUntil(self.registration.showNotification(performer + ' is online', {
	  tag: performer,
	  icon: 'https://pwa.oohcams.com/images/icons/icon-192x192.png',
	  image: 'https://pwa.oohcams.com/images/stills/' + performer + '.jpg',
	  actions: [
		{
		  action: 'chat',
		  title: 'Chat'
		}
	  ]
    }));
});

self.addEventListener('notificationclick', (evt) => {
  const performer = evt.notification.tag;
  const targetUrl = 'https://pwa.oohcams.com/cam/' + performer + '?notif=1';
  evt.notification.close();
  evt.waitUntil(clients.openWindow(targetUrl));
});