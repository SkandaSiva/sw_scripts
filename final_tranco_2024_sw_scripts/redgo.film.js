/* eslint-disable */
// [START initialize_firebase_in_sw]
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
	'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);

const firebaseConfig = {
	apiKey: 'AIzaSyDygyLoQA6s_zRJEQzW3c44xXlc8FL1Lzw',
	authDomain: 'blueonline-redcarpet.firebaseapp.com',
	projectId: 'blueonline-redcarpet',
	storageBucket: 'blueonline-redcarpet.appspot.com',
	messagingSenderId: '905879077885',
	appId: '1:905879077885:web:1083e05bd721778a210f94'
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.onBackgroundMessage((payload) => {
	// Customize notification

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.icon
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions
	);
});
// [END background_handler]
/* eslint-enable */
