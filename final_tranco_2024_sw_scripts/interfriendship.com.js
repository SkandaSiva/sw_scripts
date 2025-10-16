// *************************
// This is our serviceworker
// *************************

// Include the workbox library
importScripts('/js/workbox-v4.1.1/workbox-sw.js');

// Set path to the library
workbox.setConfig({
	modulePathPrefix: '/js/workbox-v4.1.1/',
	//debug: (self.registration.scope.indexOf('//debug.') > 0)	// <- output debug info in console on debug page
});
console.log("SCOPE: "+self.registration.scope);
if (workbox) {
	console.log('Workbox is loaded.');
} else {
	throw new Error('Workbox didn\'t load!');
}

workbox.precaching.precacheAndRoute([
	{
		// Precache the offline info page for being available when the network fails
		url: '/pwa-offline.html',
		// If the precached content changes, also change this revision number for the cache handler!
		revision: '1.0'
	}
]);

// Cache CSS files
workbox.routing.registerRoute(
	/\.css$/,
	// Use cache but update in the background.
	new workbox.strategies.StaleWhileRevalidate({
		// Use a custom cache name.
		cacheName: 'css-cache',
	})
);

// Cache JS files
workbox.routing.registerRoute(
	/\.js$/,
	// Use cache but update in the background.
	new workbox.strategies.StaleWhileRevalidate({
		// Use a custom cache name.
		cacheName: 'js-cache',
	})
);

// Cache the favicon
workbox.routing.registerRoute(
	/^favicon\.ico$/,
	new workbox.strategies.CacheFirst({
		// Use a custom cache name.
		cacheName: 'favicon-cache',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache for a maximum of a week.
				maxAgeSeconds: 7 * 24 * 60 * 60,
			})
		],
	})
);

try {
	// Cache image files except images from the pix server and chat gallery/snapshot images
	var imgregex = new RegExp("(?<!(\/chat\/(s|g)pic(\/t)?\/[0-9]+)|(\/\/(secure-)?pix[0-9]?\.interfriendship\.com\/.*))\.(png|jpg|jpeg|svg|gif)$");
	workbox.routing.registerRoute(
		imgregex,
		// Use the cache if it's available.
		new workbox.strategies.CacheFirst({
			// Use a custom cache name.
			cacheName: 'image-cache',
			plugins: [
				new workbox.expiration.Plugin({
					// Cache only 50 images.
					maxEntries: 50,
					// Cache for a maximum of a day.
					maxAgeSeconds: 24 * 60 * 60,
				})
			],
		})
	);
}
catch(e) {
	// if there is no support for negative lookaheads in regular expressions,
	// let's continue without image caching, but don't affect execution of the service worker
}

//Cache fonts
//
// Nein, wir cachen erst mal keine Fonts, muss nicht zwingend sein und hat im Internet Explorer zu Problemen geführt.
// Außerdem gibt's ja noch den Browser-Cache. | Manu 11/2020
/*
workbox.routing.registerRoute(
	/\.(?:ttf|eot|svg|woff)$/,	
	// Use the cache if it's available.
	new workbox.strategies.CacheFirst({
		// Use a custom cache name.
		cacheName: 'font-cache',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache up to 25 fonts.
				maxEntries: 25,
				// Cache for a maximum of 30 days.
				maxAgeSeconds: 30 * 24 * 60 * 60,
			})
		],
	})
);
*/

// Do not cache women big thumbs - preserve the cache space for other common things
workbox.routing.registerRoute(
	/.*\/\/pix\.interfriendship\.com\/bigthumb\/.*/,
	new workbox.strategies.NetworkOnly()
);

// Cache a limited number of thumbnails - there are too many to cache it all
workbox.routing.registerRoute(
	/.*\/\/pix\.interfriendship\.com\/pix\/daten\/.*/,
	// Use the cache if it's available.
	new workbox.strategies.CacheFirst({
		// Use a custom cache name.
		cacheName: 'thumbs',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache only 20 thumbnails.
				maxEntries: 20,
				// Cache for a maximum of one day.
				maxAgeSeconds: 24 * 60 * 60,
			})
		]
	})
);

// Cache a limited number of fixed thumbnails
workbox.routing.registerRoute(
		/.*\/\/pix\.interfriendship\.com\/img\/fixedthumb\/.*/,
	// Use the cache if it's available.
	new workbox.strategies.CacheFirst({
		// Use a custom cache name.
		cacheName: 'fixedthumbs',
		plugins: [
			new workbox.expiration.Plugin({
				// Cache only 20 thumbnails.
				maxEntries: 20,
				// Cache for a maximum of one day.
				maxAgeSeconds: 24 * 60 * 60,
			})
		]
	})
);


// Do not cache the serviceworker itself - would cause strange side effects - it's being cached using special rules! 
workbox.routing.registerRoute(
	/^serviceworker\.js$/,
	new workbox.strategies.NetworkOnly()
);

// We should NOT set a default strategy for all other requests -
// Reason 1: POST-Requests may not be handled by the service worker
//           (even not by using a "NetworkOnly()" strategy, which would result in warnings either) 
// Reason 2: Requests to normal sites shouldn't be cached
//workbox.routing.setDefaultHandler(
//	new workbox.strategies.StaleWhileRevalidate()
//);

// This "catch" handler is triggered when any of the other routes fail to generate a response.
workbox.routing.setCatchHandler(({event}) => {
	// Use event, request, and url to figure out how to respond.
	// One approach would be to use request.destination, see
	// https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
	switch (event.request.destination) {
		case 'document':
			return caches.match('/pwa-offline.html'); // we have precached this page in the pwa installer script
			break;
		
		default:
			// If we don't have a fallback, just return an error response.
			return Response.error();
	}
});




/*
 * *************************
 * 
 *  PUSH NOTIFICATION STUFF
 *  
 * ************************* 
 */

/**
 * Check for new push notifications 
 */
self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.');
	//console.log(event);
	if (event.data !== null) {
		// event.data might be null if there are problems with encryption data or invalid user auth keys!
		options = JSON.parse(event.data.text());
		//console.log(options);
		if (typeof(options.title) != 'undefined' && options.title != '') {
			// Show notification (only if required title is set)
			event.waitUntil(registration.showNotification(options.title, options));
			// Send received state
			fetch('/ajax/push-notifications.php', {  
			    method: 'post',
			    headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
			    body: 'action=set_received&endpoint='+options.data.endpoint+'&uid='+options.data.uid
			});
		}
	}
});

/**
 * Check for click on push notification
 * 
 * Note: There is currently an annoying windows bug which does ignore notificationclick event if
 * message (from google chrome) has been placed in the notficiation center. Could not find any workaround for this!
 */
self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Push clicked.');
	//console.log(event);
	var url = event.notification.data.actionUrl;
	if (url == '') return;
    event.notification.close(); // Close notification (possibly being already performed by the OS itself like on MS Windows)
	event.waitUntil(
		self.clients.matchAll({includeUncontrolled: true}).then(matchedClients => {
	        for (client of matchedClients) {
	        	if (client && client.url && client.url.indexOf(url) >= 0) {
	            	// If url is already opened, just set focus on it
	                return client.focus();
	            }
	        }
	        // Open url
	        self.clients.openWindow(url).then(function (client) { if (client) client.focus(); });
	        return true;
		})
	);
});