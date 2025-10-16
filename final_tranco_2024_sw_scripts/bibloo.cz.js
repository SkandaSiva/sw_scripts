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

/* eslint-env browser, serviceworker, es6 */

'use strict';

/* eslint-disable max-len */

const applicationServerPublicKey = 'BJPIUaIbz1LkdluizjwCU3aYvHsljY65AG1zHHtP-ernWeLdEVrzePJXwZLzZQhVEMV9GkrRGm3RzngMsn98YLQ';

/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

var pushOpenUrl = '';

function gettimestampexpir() {
	return new Date().getTime();
}


self.addEventListener('push', function (event) {

	var json = event.data.json();
	// console.log("PUSH!");
	// console.log(json);
	if (gettimestampexpir() > json.expirace) return;
	const title = json.title;
	const options = {
		body: json.body,
		icon: json.icon,
		image: json.image,
		badge: json.badge,
		data: json.url,
		actions: json.actions,
		renotify: true,
		tag: 'push',
		requireInteraction: true,
		vibrate: [200, 100, 200, 100, 200, 100, 200],
	};
	pushOpenUrl = json.url;

	//console.log(gettimestampexpir());
	//  console.log(json.expirace - gettimestampexpir() - 30);

	var fetch_url = '/_ajax/save_subscription.php?shown=' + json.shown_id + "&hash=" + json.shown_hash;
	fetch(fetch_url);
	var noti = self.registration.showNotification(title, options).then(() => {
			self.registration.getNotifications({tag: 'push'}).then(notifications => {
				setTimeout(() => notifications[0].close(), json.expirace - gettimestampexpir() - 30);
			});
		}
	);
	event.waitUntil(noti);
});

self.addEventListener('notificationclick', function (event) {

	event.notification.close();

	event.waitUntil(
		clients.openWindow(event.notification.data)
	);
});

self.addEventListener('pushsubscriptionchange', function (event) {
	console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	event.waitUntil(
		self.registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		})
			.then(function (newSubscription) {
				// TODO: Send to application server
				console.log('[Service Worker] New subscription: ', newSubscription);
			})
	);
});
