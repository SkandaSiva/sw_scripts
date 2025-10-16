/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
* New configuration for app@pulseservice.com
*/
firebase.initializeApp({
    // apiKey: "AIzaSyDSV33Yd8Ag0qN6EUfeWZEzkDzlhENifjQ",
    // authDomain: "newsite-b204a.firebaseapp.com",
    // databaseURL: "https://newsite-b204a.firebaseio.com",
    // projectId: "newsite-b204a",
    // storageBucket: "newsite-b204a.appspot.com",
    // messagingSenderId: "514328577906",
    // appId: "1:514328577906:web:1cb44cdc7448461e433feb"
    apiKey: "AIzaSyADxdl2apmKwBd9MSceEIPX7Tf4OkpzwM0",
    authDomain: "czech-5c06a.firebaseapp.com",
    projectId: "czech-5c06a",
    storageBucket: "czech-5c06a.appspot.com",
    messagingSenderId: "1086704232253",
    appId: "1:1086704232253:web:6ee17bb3dca3be21e3c754",
    measurementId: "G-CT43X20MF0"
});

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw-d1.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
