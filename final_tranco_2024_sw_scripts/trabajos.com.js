// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');

//Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '542056719901'
});

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the background (Web app is closed or not in browser focus) 
// then you should implement this optional method.
messaging.setBackgroundMessageHandler(function(payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
	const notificationTitle = payload.notification.title;
	  
	// Customize notification here
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.icon,
		click_action: payload.notification.click_action
	};
  
	return self.registration.showNotification(notificationTitle, notificationOptions);
});