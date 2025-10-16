const FIREBASE_SETTINGS = {"appConfig":{"apiKey":"AIzaSyD6IIwmKc2cpxXvGkeBVnD0iw9c7PjxWGM","authDomain":"radiocontinental.firebaseapp.com","projectId":"radiocontinental","storageBucket":"radiocontinental.appspot.com","messagingSenderId":"1012549902688","appId":"1:1012549902688:web:c755fb4e2d37da6f723e05","measurementId":"G-QXEMKZSQDJ"},"vapidPublicKey":"BLosBtoo1I1zwB339MtBaPrF6AJdsljJw090k6BnPY5AY3JlWvl1V1O029Ip1TwoazIRNo8Up_L0nQVfinTjA2I"};
const WEB_PUSH_SETTINGS = {"enabled":true};

self.addEventListener('push', async function(e) {
	try {
		let msg = e.data.json();
		let id = msg.fcmOptions && msg.fcmOptions.analyticsLabel;
		let tag = msg.data.tag;
		if (tag) {
			await e.waitUntil(self.registration.getNotifications({ tag }).then((notifications)=>{
				for (let notif of notifications) notif.close();
			}));
		}
		if (!msg.notification && msg.data && msg.data.tadevel_notification) {
			await e.waitUntil(Promise.all([
				self.registration.showNotification(msg.data.title, {
					... msg.data,
					... msg.data.actions && { actions: JSON.parse(msg.data.actions) },
					tag,
					data: {
						... msg.data,
						FCM_MSG: msg,
					},
				}),
				... id ? [ fetch(`/api/v1/push-notification/${id}/track?event=show`, {method: 'POST'}).catch(err=>{}) ] : [],
				... msg.data.deviceInstanceId ? [ fetch(`/api/v1/device-instance/${msg.data.deviceInstanceId}/track?event=show`, {method: 'POST'}).catch(err=>{}) ] : [],
			])
			.catch((err)=>{
				console.error(err);
				fetch(`/api/v1/push-notification/${id}/track?event=error`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						message: err && err.message,
						stack: err && err.stack,
					}),
				});
			}));
		}
	} catch (err) {
		console.error(err);
		fetch(`/api/v1/push-notification/error`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: err && err.message,
				stack: err && err.stack,
			}),
		});
	}
});
let lastClickId;
self.addEventListener('notificationclick', async function(e) {
	let id = e.notification.data && e.notification.data.FCM_MSG && e.notification.data.FCM_MSG.fcmOptions.analyticsLabel;
	lastClickId = id;
	if (e.action) {
		if (/^https?:/.test(e.action)) {
			await e.waitUntil(Promise.all([
				clients.openWindow(e.action),
				... id ? [ fetch(`/api/v1/push-notification/${id}/track?event=action`, {method: 'POST'}).catch(err=>{}) ] : [],
				... e.notification.data.deviceInstanceId ? [ fetch(`/api/v1/device-instance/${e.notification.data.deviceInstanceId}/track?event=action`, {method: 'POST'}).catch(err=>{}) ] : [],
			]));
		}
	} else {
		await e.waitUntil(Promise.all([
			clients.openWindow(e.notification.data.FCM_MSG.fcmOptions.link),
			... id ? [ fetch(`/api/v1/push-notification/${id}/track?event=click`, {method: 'POST'}).catch(err=>{}) ] : [],
			... e.notification.data.deviceInstanceId ? [ fetch(`/api/v1/device-instance/${e.notification.data.deviceInstanceId}/track?event=click`, {method: 'POST'}).catch(err=>{}) ] : [],
		]));
	}
	e.notification.close();
});
self.addEventListener('notificationclose', async function(e) {
	let id = e.notification.data && e.notification.data.FCM_MSG && e.notification.data.FCM_MSG.fcmOptions.analyticsLabel;
	if (lastClickId == id) return;
	if (id) {
		await e.waitUntil(Promise.all([
			fetch(`/api/v1/push-notification/${id}/track?event=close`, {method: 'POST'}).catch(err=>{}),
			... e.notification.data.deviceInstanceId ? [ fetch(`/api/v1/device-instance/${e.notification.data.deviceInstanceId}/track?event=close`, {method: 'POST'}).catch(err=>{}) ] : [],
		]));
	}
});

if (FIREBASE_SETTINGS) {
	importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
	importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');
	firebase.initializeApp(FIREBASE_SETTINGS.appConfig);
	if (firebase.messaging.isSupported()) {
		firebase.messaging();
		firebase.messaging().usePublicVapidKey(FIREBASE_SETTINGS.vapidPublicKey);
	}
}

console.log("Installing SW.");
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
workbox.core.skipWaiting();
workbox.core.clientsClaim();
