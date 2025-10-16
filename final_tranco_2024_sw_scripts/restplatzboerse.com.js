'use strict';

// Increment version number to update offline page
var cacheVersion = 8;
var currentCache = {
	offline: 'offline-cache-V' + cacheVersion
};
const offlinePage = '/offline/';

this.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(currentCache.offline).then(function(cache) {
			return cache.addAll([
				offlinePage,
			]);
		})
	);
});

this.addEventListener('fetch', (event) => {
	const reqUrl = event.request.url;
	const reqReferrer = event.request.referrer;

	// excluded paths/urls for service worker
	if (
		reqReferrer.match('/ausdruck')	// prevent offline page on print pages
		|| reqUrl.match('^.*(/typo3/).*$')	// Typo3 backend
		|| reqUrl.match('^.*(flux.reisen).*$')	// Safari iOS/MacOS: api requests not fired properly if going back/forward in browser history
	) {
		return;
	}
	event.respondWith(
		caches
			.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}
				return fetch(event.request);
			})
			// eslint-disable-next-line no-unused-vars
			.catch((error) => caches.open(currentCache.offline)
				.then((cache) => cache.match(offlinePage)))
	);
});

this.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					if (cacheName !== currentCache.offline) {
						return true;
					}
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});
