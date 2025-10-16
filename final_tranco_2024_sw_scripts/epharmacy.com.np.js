importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.0/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyDOB5rOgtVoh66wSZ_5GZ1ILJ8sd4yozZ0",
    authDomain: "epharmacy-mobile.firebaseapp.com",
    databaseURL: "https://epharmacy-mobile.firebaseio.com",
    projectId: "epharmacy-mobile",
    storageBucket: "epharmacy-mobile.appspot.com",
    messagingSenderId: "1035831197794",
    appId: "1:1035831197794:web:67cffca0d127763cd2913b" 
};

firebase.initializeApp(config);

// Get the Firebase messaging instance
const messaging = firebase.messaging();

// New method for handling background messages (instead of setBackgroundMessageHandler)
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    // Show notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

