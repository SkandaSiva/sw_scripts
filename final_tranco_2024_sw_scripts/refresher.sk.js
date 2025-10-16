'use strict';

// const CACHE_NAME = 'main-v12';
// const CACHED_DESTINATIONS = ['image', 'style', 'script'];
// const CACHED_FILE_TYPES = ['.svg', '.jpg', '.png', '.css', '.js', '.webp'];
//
// self.addEventListener('activate', event => {
// 	event.waitUntil(
// 		caches.keys().then(function(cacheNames) {
// 			return Promise.all(
// 				cacheNames.map(function(cacheName) {
// 					if (cacheName != CACHE_NAME) {
// 						return caches.delete(cacheName);
// 					}
// 				})
// 			);
// 		}),
// 		caches.open(CACHE_NAME).then(function(cache) {
// 			return cache.addAll([
// 				'/offline',
// 				'/static/css/img/logo-offline.jpg'
// 			]);
// 		})
// 	);
// });
//
// self.addEventListener('fetch', function(event) {
//
// 	event.respondWith(async function() {
//
// 		const cachedResponse = await caches.match(event.request);
//
// 		if( cachedResponse ) {
// 			return cachedResponse;
// 		}
//
// 		try {
// 			const networkResponse = await fetch(event.request);
//
// 			if( event.request.method == 'GET' && event.request.url.indexOf(self.registration.scope) == 0 && networkResponse.status == 200 && CACHED_DESTINATIONS.includes(event.request.destination) && CACHED_FILE_TYPES.some(substring=>event.request.url.includes(substring)) ) {
// 				const cache = await caches.open(CACHE_NAME);
// 				cache.put(event.request, networkResponse.clone());
// 			}
//
// 			return networkResponse;
//
// 		} catch (error) {
//
// 			if (event.request.mode === 'navigate') {
//
// 				var requestData = {
// 					cache: event.request.cache,
// 					destination: event.request.destination,
// 					method: event.request.method,
// 					mode: event.request.mode,
// 					redirect: event.request.redirect,
// 					referrer: event.request.referrer,
// 					referrerPolicy: event.request.referrerPolicy,
// 					headers: event.request.headers,
// 					agent: self.navigator.userAgent,
// 				};
//
// 				fetch('/error-log?v=4', {
// 					method: 'post',
// 					headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
// 					body: 'error=url: ' + encodeURI(event.request.url) + ' msg: ' + encodeURI(error) + ' request: ' + JSON.stringify(requestData)
// 				});
//
// 				return caches.match('/offline');
// 			}
// 		}
//
// 	}());
// });

self.addEventListener('push', function(event) {

	var promiseChain = Promise.resolve();
	var data = JSON.parse(event.data.text());
	let title = ( typeof(data.title) != 'undefined' ) ? data.title : data.notification.title;
	let options = ( typeof(data.options) != 'undefined' ) ? data.options : data.notification.options;
	let url = ( typeof(options.data.url) != 'undefined' ) ? options.data.url : '';

	if( url.length > 0 ) {

		const urlToOpen = url;

		promiseChain = clients.matchAll({type: 'window', includeUncontrolled: true}).then((windowClients) => {
			let showNotification = true;
			let urlToOpenNoHash = null;

			if (urlToOpen.indexOf('#') > 0) {
				urlToOpenNoHash = urlToOpen.substring(0, urlToOpen.indexOf('#'));
			}

			for (let i = 0; i < windowClients.length; i++) {
				const windowClient = windowClients[i];

				let clientUrl = windowClient.url;
				if (clientUrl.indexOf('#') > 0) {
					clientUrl = clientUrl.substring(0, clientUrl.indexOf('#'));
				}

				if ((clientUrl === urlToOpen || clientUrl === urlToOpenNoHash) && windowClient.focused) {
					showNotification = false;
					break;
				}
			}

			if (showNotification) {
				return self.registration.showNotification(title, options)
			} else {
				return false;
			}
		});
	}
	else {
		promiseChain = self.registration.showNotification(title, options);
	}

	event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {

	event.notification.close();

	var promiseChain = Promise.resolve();

	if( event.notification.data && event.notification.data.url ) {

		const urlToOpen = event.notification.data.url;

		promiseChain = clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
			let matchingClient = null;
			let urlToOpenNoHash = null;
			let userId = null;

			if( urlToOpen.indexOf('#') > 0 ) {
				urlToOpenNoHash = urlToOpen.substring(0, urlToOpen.indexOf('#'));
				var hash = urlToOpen.substr(urlToOpen.indexOf('#') + 1);
				if( hash.indexOf('=') > 0 ) {
					var hashExploded = hash.split('=');
					if( hashExploded[0] == 'u' ) {
						userId = parseInt(hashExploded[1]);
					}
				}
			}

			for (let i = 0; i < windowClients.length; i++) {
				const windowClient = windowClients[i];

				let clientUrl = windowClient.url;
				if( clientUrl.indexOf('#') > 0 ) {
					clientUrl = clientUrl.substring(0, clientUrl.indexOf('#'));
				}

				if (clientUrl === urlToOpen || clientUrl === urlToOpenNoHash) {
					matchingClient = windowClient;
					break;
				}
			}

			if (matchingClient) {
				if(userId) {
					matchingClient.postMessage({ type: 'switch_conversation', user_id: userId });
				}
				return matchingClient.focus();
			} else {
				return clients.openWindow(urlToOpen);
			}
		});
	}

	event.waitUntil(promiseChain);
});