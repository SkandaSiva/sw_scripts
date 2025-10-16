importScripts('./ngsw-worker.js');
(function(){
	// Give the service worker access to Firebase Messaging.
	// Note that you can only use Firebase Messaging here, other Firebase libraries
	// are not available in the service worker.
	importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
	importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

	// Initialize the Firebase app in the service worker by passing in the
	// messagingSenderId.
	firebase.initializeApp({
		apiKey: "AIzaSyBbo7DuaUW-ek8vf80ABbOQTl-OlJy3JfQ",
		authDomain: "loyal-road-692.firebaseapp.com",
		databaseURL: "https://loyal-road-692.firebaseio.com",
		projectId: "loyal-road-692",
		storageBucket: "loyal-road-692.appspot.com",
		messagingSenderId: "868263635750",
		appId: "1:868263635750:web:7358bd54bc31c7fb2c2fe7",
		measurementId: "G-FJFB69BGSV"
	});

	// Retrieve an instance of Firebase Messaging so that it can handle background
	// messages.
	const messaging = firebase.messaging();

	messaging.onBackgroundMessage(function(payload) {
		// console.log('[firebase-messaging-sw.js] Received background message ', payload);
		// Customize notification here
		const notificationTitle = payload.data.title;
		const notificationOptions = {
			body: payload.data.body,
			dir: 'rtl',
			lang: 'ar',
			icon: '/mstamlApp/ar/assets/icons/icon-2024-192x192.png',
			badge: '/mstamlApp/ar/assets/icons/icon-transparent-2024-96x96.png',
			requireInteraction: true,
			data: payload.data
		};

		return self.registration.showNotification(notificationTitle, notificationOptions);
	});

	self.addEventListener('notificationclick', function(event) {
		// console.log('event clicked: ', event);
		event.notification.close();
		event.waitUntil(async function() {
			if (self.clients.openWindow){
				const client = await self.clients.openWindow('/?showPwa=1');
				// Send a message to the client.
				client.postMessage({myNotificationClickData: event.notification.data});
			}
		}());
	});
})();

(function(){
	self.addEventListener('activate', (event) => {
		event.waitUntil(
			fetch('https://www.mstaml.com/baseInfo-rnd1731128973-6c47736-44810b6-2f3b32d-ef6a914-api2-2-0.js')		);
	});
})();
