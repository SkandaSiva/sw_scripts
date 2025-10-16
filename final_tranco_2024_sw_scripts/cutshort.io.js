importScripts("https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js");

// var service_worker_version = '1.0.0'
// var cache_name = 'cutshort-cache-v' + service_worker_version
// 	// cache_name += ' -debug 1.3'

// var current_caches = {
// 	cache_1: cache_name
// };

var last_logged_in_user

// var urls_to_be_pre_cached = [
// 	'/offline',
// 	'/auth-app-shell',

// 	'https://cdn.cutshort.io/public/images/caveman.gif',
// 	'https://cdn.cutshort.io/public/images/new-icon.png',
// 	'https://cdn.cutshort.io/public/images/new_logo_half_padded.png',
// 	'https://cdn.cutshort.io/public/images/new-loader-white-matte.gif',
// 	'https://cdn.cutshort.io/public/images/new-loader-black-matte.gif',
// ]

// var url_cache_to_be_updated_on_req = [
// 	'/voila',
// 	'/js/',
// 	'/public/images/',
// 	'/public/styles/',
// 	'/styles',
// 	'/webassets/'
// ]

// var acceptable_status_codes = [200, 304]

function messageAllClients(payload, options) {

	payload = payload || 'default'
	options = options || {}

	clients.matchAll({
		type: 'window'
	}).then(function(windowClients) {

		// console.log('dispatching message to clients', payload, windowClients, 'except', options.except_clients)
		for (var i = 0; i < windowClients.length; i++) {
			var client = windowClients[i];
			if (options.except_clients && options.except_clients.indexOf(client.id) > -1) {
				console.log('Skipping', payload, 'for', client.id)
			} else {
				// console.log('Dispatched to', client.id)
				client.postMessage(payload)
			}
		}
	})

}

// function preCacheAssets() {

// 	caches.open(current_caches.cache_1).then(function(cache) {
// 		// console.log('caching', urls_to_be_pre_cached)

// 		var cache_ops = []
// 		urls_to_be_pre_cached.map(function(url) {

// 			var request = new Request(url, {
// 				mode: 'no-cors'
// 			});
// 			cache_ops.push(fetch(request).then(response => {
// 				if (acceptable_status_codes.indexOf(response.status) > -1) return cache.put(request, response)
// 			}))

// 		})

// 		Promise.all(cache_ops).then(function() {
// 			// console.log('done caching')
// 			messageAllClients({
// 				message: 'app_cache_updated',
// 			})
// 			// console.log('New version available!')
// 		})

// 	});

// }

// self.addEventListener('install', function(event) {

// 	// preCacheAssets()

// 	self.skipWaiting()
// });

self.addEventListener('message', function(event) {
	// console.log(event);
	// if (event.data == 'pre_cache_assets') {
	// 	preCacheAssets()
	// }

	// console.log(last_logged_in_user, event.data.user)
	if (event.data.type == 'retrieved_user') {
		var json = event.data
		if (last_logged_in_user && last_logged_in_user._id != json.user._id) {
			console.log('Logged in user mismatch', last_logged_in_user._id, json.user._id)
			messageAllClients({
				message: 'logged_in_user_changed',
			}, {
				except_clients: [event.source.id]
			})
		}
		last_logged_in_user = json.user
	}
});

// self.addEventListener('activate', event => {
// 	var expectedCacheNames = Object.keys(current_caches).map(function(key) {
// 		return current_caches[key];
// 	});
// 	event.waitUntil(
// 		caches.keys().then(function(cacheNames) {
// 			// console.log(cacheNames, expectedCacheNames)
// 			return Promise.all(
// 				cacheNames.map(function(cacheName) {
// 					// console.log(expectedCacheNames.indexOf(cacheName))
// 					if (expectedCacheNames.indexOf(cacheName) == -1) {
// 						return caches.delete(cacheName).then(function() {
// 							// console.log('deleted cache', cacheName)
// 						});
// 					}
// 				})
// 			);
// 		})
// 	);
// });

// self.addEventListener('fetch', event => {

// 	// console.log('sw event url', event.request.url)

// 	var current_path = event.request.url.split('/')
// 	current_path = '/' + current_path.splice(3).join('/')
// 		// console.log('sw', current_path)

// 	var required_req = event.request
// 	var update_cache = false
// 	var requesting_app_shell = false

// 	if (event.request.mode == 'navigate') {
// 		if (current_path.indexOf('/profile/') == 0) {
// 			requesting_app_shell = true
// 			required_req = new Request('/auth-app-shell', {
// 				headers: event.request.headers
// 			})
// 		}
// 	}

// 	// console.log('Checking current_path', current_path)
// 	for (var u = 0; u < url_cache_to_be_updated_on_req.length; u++) {
// 		if (current_path.indexOf(url_cache_to_be_updated_on_req[u]) > -1 && current_path.indexOf('/shadmin') == -1) {
// 			// console.log('Will cache current_path', current_path)
// 			update_cache = true
// 			break
// 		}
// 	}

// 	if (update_cache || requesting_app_shell) {
// 		event.respondWith(
// 			caches.open(current_caches.cache_1).then(function(cache) {
// 				return cache.match(required_req, {
// 					ignoreSearch: required_req.url.indexOf('?') != -1
// 				}).then(function(response) {

// 					// var fetchAction = fetch(required_req)

// 					if (response) {
// 						return response
// 					} else {
// 						// console.log('Going to server for', required_req)
// 						return fetch(required_req).then(function(response) {
// 							if (acceptable_status_codes.indexOf(response.status) > -1) cache.put(required_req, response.clone());
// 							return response;
// 						}, function() {
// 							return errorCase(current_path)
// 						})
// 					}

// 				});
// 			})
// 		);
// 	} else {
// 		if (current_path.indexOf('/partial_template') > -1 || required_req.mode == 'navigate' || current_path == '/getcurrentuser') {
// 			event.respondWith(
// 				fetch(required_req).then(function(response) {
// 					return response;
// 				}, function() {
// 					return errorCase(current_path)
// 				})
// 			);
// 		}
// 	}

// 	function errorCase(c_p) {
// 		if (c_p.indexOf('/partial_template') > -1) {
// 			return new Error()
// 		} else {
// 			return caches.open(current_caches.cache_1).then(function(cache) {
// 				return cache.match('/offline')
// 			})
// 		}
// 	}

// });




// push notification code

// self.addEventListener('push', function(event) {
// 	// console.log('Push message received', event);

// 	var received_json = event.data.json()
// 		// console.log(received_json);

// 	// var payload = event.data

// 	var config = {};
// 	config.body = received_json.body
// 	config.icon = received_json.icon || 'https://cdn.cutshort.io/public/images/og-new-logo.jpg'
// 	config.tag = 'cutshort-io-' + received_json.tag
// 	config.requireInteraction = true
// 	if (received_json.requireInteraction != undefined) config.requireInteraction = received_json.requireInteraction
// 	if (received_json.actions) {
// 		config.actions = received_json.actions
// 	}

// 	if (received_json.image) {
// 		config.image = received_json.image
// 	}

// 	config.data = {}
// 	config.data.click_url = received_json.click_url

// 	// console.log('Notif config', config)

// 	event.waitUntil(
// 		self.registration.showNotification(received_json.title, config)
// 	);
// });

// self.addEventListener('notificationclick', function(event) {
// 	var current_notif = event.notification
// 		// console.log('Notification click: ', current_notif);
// 	current_notif.close();
// 	var url = current_notif.data.click_url;
// 	event.waitUntil(
// 		self.clients.matchAll({
// 			type: 'window'
// 		})
// 		.then(function(windowClients) {

// 			// console.log('windowClients', windowClients)

// 			for (var i = 0; i < windowClients.length; i++) {
// 				var client = windowClients[i];
// 				// console.log('checking client', client)
// 				if (client.url === url && 'focus' in client) {
// 					return client.focus();
// 				}
// 			}
// 			if (clients.openWindow) {
// 				return clients.openWindow(url);
// 			}
// 		})
// 	);
// });