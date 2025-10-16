importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js');

var firebaseConfig = {
	apiKey: "AIzaSyD0cqpPjFeDw47xTljCnvuMHlzwQn8eiWE",
	authDomain: "textstudio-dc126.firebaseapp.com",
	databaseURL: "https://textstudio-dc126.firebaseio.com",
	projectId: "textstudio-dc126",
	storageBucket: "textstudio-dc126.appspot.com",
	messagingSenderId: "949759598678",
	appId: "1:949759598678:web:a791718ce98379bea49bf7"
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
