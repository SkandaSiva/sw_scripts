importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.12.0/firebase-messaging.js');

var firebaseConfig = {
	apiKey: "AIzaSyCmTxCaVUmt_j1LMV8p8aTc1y3NDgDl3u4",
	authDomain: "push-topquizz.firebaseapp.com",
	databaseURL: "https://push-topquizz.firebaseio.com",
	projectId: "push-topquizz",
	storageBucket: "push-topquizz.appspot.com",
	messagingSenderId: "585484543971",
	appId: "1:585484543971:web:efc6ff1e47f707fce3a2d6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	var notification = payload.data;
	notification.data = {};
	notification.data.click_action = notification.click_action;
	notification.requireInteraction = true;
	return self.registration.showNotification(notification.title, notification);
});

self.addEventListener('notificationclick', function(e) {
	e.notification.close();
	e.waitUntil(self.clients.openWindow(e.notification.data.click_action));
});
