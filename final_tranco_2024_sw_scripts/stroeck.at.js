 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');
 
 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
	apiKey: "AIzaSyACjOrIBqhnqTfUS9G_ReHW4XaNkWl7c48",
    authDomain: "stroeck-54cdb.firebaseapp.com",
    projectId: "stroeck-54cdb",
    storageBucket: "stroeck-54cdb.appspot.com",
    messagingSenderId: "356993249823",
    appId: "1:356993249823:web:2720c6812157ed52485b2a"
 });
 
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]

messaging.setBackgroundMessageHandler(function(payload) {
	
	var notification = JSON.parse(payload.data.notification);
	
	// Customize notification here
	const notificationTitle = notification.title;
	const notificationOptions = {
		requireInteraction : true,
		renotify : true
	};
	
	for (var key in notification) {
		if( key != "title" && key != "subID" )  {
			var keyVal = notification[key];
			notificationOptions[key] = keyVal;
		}
	}
	
	return self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', function(event) {
	var notification = event.notification.data;
	event.notification.close();
	
	clients.openWindow(notification.url);
}, false);
// [END background_handler]
