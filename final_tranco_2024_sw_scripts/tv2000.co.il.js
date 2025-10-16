
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

var firebaseConfig = {
	  apiKey: "AIzaSyBCL1LrMwgIfDJ4KcjhY7z8g_KwneBir-0",
	  authDomain: "radio2000-1efc4.firebaseapp.com",
	  projectId: "radio2000-1efc4",
	  storageBucket: "radio2000-1efc4.appspot.com",
	  messagingSenderId: "981154503259",
	  appId: "1:981154503259:web:abeb937eea3a7632e7fd7e",
	  measurementId: "G-58CJQH6KSB"
	};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {

	console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});