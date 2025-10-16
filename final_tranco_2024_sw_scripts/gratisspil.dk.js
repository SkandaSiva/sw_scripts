// This file must be placed in the root dir if we want to 
// cache files for offline use in the future.

"use strict";

const VERSION = 'v0.0.5';

self.addEventListener('install', function(event) {
	//console.log('sw.js file installed', event);
	
	// Causes a newly installed service worker to progress into the activating state, 
	// regardless of whether there is already an active service worker
	self.skipWaiting();
	
	event.waitUntil(
		caches.open(VERSION).then(function(cache) {
			let htmlRoot = self.location.host == 'localhost' ? 'gratisspil' : 'gs';
			
			return cache.addAll([
				'/' + htmlRoot + '/include/image/gs-logo-256x256.png'
			]);
		})
	);
});

// Very good explanation about different approaches to 
// "Caching Files with Service Worker"
//
// Source: https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
self.addEventListener('fetch', function(event) {
	// Although Adblock Plus is de-activated, it still blocks files matching the EasyList.
	// I would have to completely disable the plugin before ads are served.
	// This is an highly unexpected behaviour, which must be a bug between Chrome and Adblock Plus.
	//
	// Until bug is fixed, we can't use caching, thus we must return here.
	return;
	
	//console.log('fetch event. Fetching...', event, event.request);
	
	let request = event.request;
	
	// Let the browser do its default thing for non-GET requests as they cannot be cached.
	if (request.method !== 'GET') return;

	
	// Alternatively, import excludeCachePatterns from a js-file: 
	// importScripts('path/from/webroot/to/excludeCachePatterns.js');
	var excludeCachePatterns = ['/am2/'];
	
	// All requested urls matching excludeCachePatterns will let the browser 
	// do its default fetching
	var exclude = excludeCachePatterns.some(function(element) { 
		return event.request.url.indexOf(element) !== -1;
	});
	
	// A match is found. Let the browser do its default fetching
	if (exclude) {
		return;
	}	
	
	// Prevent the default, and handle the request ourselves.
	event.respondWith(
			
		// Approach: Cache falling back to the network
		// *******************************************
		// If we've cached the ressource, return it
		// Otherwise, request ressource from the network
		caches.match(request).
			then(function(response) {
				// response: We've got a cached version
				// fetch(event.request)
				return response || fetch(request);
			}).
			catch(function(error) {
				// caches.match() throws an error when attempting to request files 
				// matching the EasyList although Adblock Plus is de-activated. 
				// This is unexpected behaviour. 
				// error contains value: "TypeError: Failed to fetch" 
				console.log('CATCH: ', error, request);
			})
			
	);
  
});

self.addEventListener('activate', function(event) {
	if (self.clients && clients.claim) {
		clients.claim();
	}
	event.waitUntil(
		caches
			.keys()
			.then(function (keys) {
				return Promise.all(
					keys
						.filter(function (key) {
							return !key.startsWith(VERSION);
						})
						.map(function (key) {
							return caches.delete(key);
						})
				);
			})
			.then(function() {
//				console.log('new service worker version registered', VERSION);
			}).catch(function (error) {
				console.error('error registering new service worker version', error);
			})
	);
});

// When Service Worker receives a push message from a server
self.addEventListener('push', function(event) {
	
	// Payload containing: title, body, icon
	let payload = {};

	try {
		payload = event.data.json();
		
		//console.log('Got notification from server: ', payload);
	} catch (e) {
		payload = {
			options: {
				title: 'Default title',
				body: 'Default message',
				icon: '/default-icon.png'
			}
		};
	}

	event.waitUntil(
		// Display the notification
		self.registration.showNotification(payload.title, payload.options).then(function() {
			
			// If we have set 'requireInteraction' = true and 'tag' is defined it means
			// the notification will not close automatically. 
			// We will close it below after 20 seconds by searching for a notification using 'tag'.
			if (typeof(payload.options.requireInteraction) == 'boolean' && payload.options.requireInteraction && typeof(payload.options.tag) == 'string') {
				// Setting up the filter to find the right notification
				let notificationFilter = {
					tag: payload.options.tag
				};
				
				self.registration.getNotifications(notificationFilter).then(function(notifications) {
					// If found, 'notifications' is a list with 1 notification inside
					
					if (notifications.length == 1) {
						let notification = notifications[0];
						
						// Default wait 20 seconds and close the notification
						var waitClose = typeof(payload.options.data.waitClose) == 'number' ? payload.options.data.waitClose : 20000;
						
						setTimeout(function() {
							notification.close();
						}, waitClose);
						
					}
					
				});
				
			}
			
		})
	);

});

self.addEventListener('message', function(event) {
	//console.log('duda', event);
});

self.addEventListener('notificationclick', function(event) {

	// close the notification
	event.notification.close();

	// see if the current is open and if it is focus it
	// otherwise open new tab
	event.waitUntil(

		self.clients.matchAll().then(function(clientList) {
 
			if (clientList.length > 0) {
	    	  
				return clientList[0].focus().then(function(windowClient) {
					
					if (event.notification.data.url && event.notification.data.url.length > 10) {
						windowClient.navigate(event.notification.data.url);
					}
				});
	
			}
	 
			return self.clients.openWindow(event.notification.data.url);
			
		})
	);
});