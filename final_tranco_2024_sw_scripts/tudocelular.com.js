/**
 * Created by j on 7/2/17.
 */
'use strict';

const version = 4;
const trackingId = 'UA-8699976-5';
self.clientid = null;

const sendAnalyticsEvent = (eventAction, eventCategory, actionTitle, clientid) => {
	
	console.log('Sending analytics event: ' + eventCategory + '/' + eventAction);
	
	if (!trackingId) {
		console.error('You need your tracking ID in analytics-helper.js');
		console.error('Add this code:\nconst trackingId = \'UA-XXXXXXXX-X\';');
		// We want this to be a safe method, so avoid throwing unless absolutely necessary.
		return Promise.resolve();
	}
	
	if (!eventAction && !eventCategory) {
		console.warn('sendAnalyticsEvent() called with no eventAction or ' +
			'eventCategory.');
		// We want this to be a safe method, so avoid throwing unless absolutely necessary.
		return Promise.resolve();
	}
	
	// Create hit data
	const payloadData = {
		// Version Number
		v:   1,
		// Client ID
		cid: clientid,
		// Tracking ID
		tid: trackingId,
		// Hit Type
		t:   'event',
		// Event Category
		ec:  eventCategory,
		// Event Action
		ea:  eventAction,
		// Event Label
		el:  actionTitle
	};
	
	// Format hit data into URI
	const payloadString = Object.keys(payloadData)
		.filter(analyticsKey => {
			return payloadData[analyticsKey];
		})
		.map(analyticsKey => {
			return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
		})
		.join('&');
	
	// Post to Google Analytics endpoint
	return fetch('https://www.google-analytics.com/collect', {
		method: 'post',
		body:   payloadString
	});
};

const getClientId = () => {
	
	if (self.clientid === null) {
		
		self.clientid = Date.now() + '-' + Math.random();
	}
	
	return self.clientid;
};

// The following (install and activate events) causes a new version
// of a registered Service Worker to replace an existing one that is
// already installed, and replace the currently active worker on open
// pages.
self.addEventListener('install', function (event) {
	
	console.log('install event...', event);
	
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
	
	console.log('activate event...', event);
	
	event.waitUntil(Promise.resolve(true).then(function () {
		
		console.log('promise in activate');
		
		self.clients.claim();
	}));
});



self.addEventListener('push', function (event) {
	
	console.log('push event...', event);
	
	let jsonData = null;
	
	if (event.data) {
		
		try {
			jsonData = event.data.json();
			
		} catch (e) { }
	}
	
	if (!jsonData) {
		
		console.log('Wrong json data');
		return;
	}
	
	if (jsonData.error) {
		
		console.log(jsonData.error_message);
		return;
	}
	
	// show the notification
	let notification = jsonData.notification;
	
	const options = {
		// "Visual Options",
		body:    notification.body,
		icon:    notification.icon,
		image:   notification.image,
		badge:   notification.badge,
		vibrate: notification.vibrate,
		sound:   notification.sound,
		dir:     notification.dir || 'ltr',
		
		// "Behavioural Options",
		tag:                notification.tags,
		data:               notification,
		requireInteraction: notification.require_interaction,
		renotify:           notification.renotify,
		silent:             false,
		
		// "Both Visual & Behavioural Options",
		actions: notification.actions,
		
		// "Information Option. No visual affect.",
		timestamp: notification.timestamp,
		
		// extra
		href: notification.href,
		action_title: notification.actions && notification.actions.length > 0 ? notification.actions[0].title : 'no-action-related'
	};
	
	const notificationPromise = self.registration.showNotification(notification.title, options);
	notificationPromise.then(() => {
		sendAnalyticsEvent('View', 'Push', notification.title, getClientId());
	});
	event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function (event) {
	
	sendAnalyticsEvent('Click', 'Push', event.notification.title, getClientId());
	
	console.log('notification click event...', event);
	
	let url = event.notification.data.href;
	
	if (url) {
		
		// fetch('/new_files/webhooks/pushn/index.php?action=notification_click&notification_id=' + event.notification.data.id, {
		// 	method: 'post'
		// });
		
		event.notification.close(); // Android needs explicit close.
		event.waitUntil(
			clients.matchAll({ type: 'window' }).then(function (windowClients) {
				console.log(windowClients);
				// Check if there is already a window/tab open with the target URL
				for (var i = 0; i < windowClients.length; i++) {
					var client = windowClients[i];
					// If so, just focus it.
					if (client.url === url && 'focus' in client) {
						return client.focus();
					}
				}
				
				// If not, then open the target URL in a new window/tab.
				if (clients.openWindow) {
					return clients.openWindow(url);
				}
			})
		);
	}
});
