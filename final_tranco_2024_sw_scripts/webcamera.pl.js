// Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js');

 const firebaseConfig = {

    apiKey: "AIzaSyDq15LSFTjuATsFVkSEEBToYj9Dsb1uFKo",

    authDomain: "webcameraplfcm.firebaseapp.com",

    projectId: "webcameraplfcm",

    storageBucket: "webcameraplfcm.appspot.com",

    messagingSenderId: "782250411245",

    appId: "1:782250411245:web:5d6d76d97ea0da92fc78e4",

    measurementId: "G-FZF4DVQ416"

  };

const isSupported = firebase.messaging.isSupported();

  


if (isSupported) {
	try {
	// // Initialize Firebase
		const app = firebase.initializeApp(firebaseConfig);

		// Initialize Firebase Cloud Messaging and get a reference to the service
		const messaging = firebase.messaging()

		 function handleClick (event) {
			  event.notification.close();
			  // Open the url you set on notification.data
			  clients.openWindow(event.notification.data.url)
			}
		    self.addEventListener('notificationclick', handleClick);
		/*
		messaging.onBackgroundMessage(payload => {
			// Customize notification here
			
			const notificationTitle = payload.notification.title + 'bg';
			const notificationOptions = {
			  body: payload.notification.body,
			  icon: payload.notification.icon,
			  image: payload.notification.image
			};
		  
		 
		  
			//self.registration.showNotification(notificationTitle,
			//  notificationOptions);
		  });
		  */
	 
	 } catch (error)
	 {
		console.log(error);
	 }
}
else
{
	console.log("not supported");
}