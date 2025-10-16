importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

try {
	firebase.initializeApp({
		apiKey: 'AIzaSyC61N_N9qMI9Wlx70pNVWRU0Dnjp_Ny_3E',
		authDomain: 'novaya-project.firebaseapp.com',
		databaseURL: 'https://novaya-project.firebaseio.com',
		projectId: 'novaya-project',
		storageBucket: 'novaya-project.appspot.com',
		messagingSenderId: '376149819123',
		appId: '1:376149819123:web:559ebed4a81eccb3fe0186',
		measurementId: 'G-C2XW7S0QCK'
	});

	const messaging = firebase.messaging();

	self.addEventListener('install', (event) => {
		self.skipWaiting();
	});

	self.addEventListener('fetch', () => {});

	messaging.onBackgroundMessage(messaging, (payload) => {
		const notificationTitle = payload.notification.title;
		const notificationOptions = {
			body: payload.notification.body,
			icon: '/logo_apple_touch_icon_mr.png',
			image: payload.notification.image,
			data: payload.data.actionUrl
		};

		self.registration.showNotification(notificationTitle, notificationOptions);
	});

	self.addEventListener('notificationclick', (event) => {
		event.notification.close();
		clients.openWindow(event.notification.data);
	});
} catch (error) {
	console.log(`Error in firebase-messaging-sw.js`);
}
