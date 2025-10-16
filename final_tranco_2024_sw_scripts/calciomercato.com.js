/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 **/
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.0.0/firebase-messaging.js');


var firebaseConfig = {
    apiKey: "AIzaSyBKov5VElAj8LkQPWBvHRF9PGjf3X5XpR8",
    authDomain: "cm-msite-web-push.firebaseapp.com",
    databaseURL: "https://cm-msite-web-push.firebaseio.com",
    projectId: "cm-msite-web-push",
    storageBucket: "cm-msite-web-push.appspot.com",
    messagingSenderId: "873848959103",
    appId: "1:873848959103:web:14565d2b150da684",
    measurementId: "G-GJV0XJ1KMD"
};


firebase.initializeApp({
    'messagingSenderId': '873848959103'
});


// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    /**
     *
     var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
     var notificationOptions = {
     body: payload.data.body,
     icon: payload.data.icon,
     data: { url:payload.data.click_action }, //the url which we gonna use later
     actions: [{action: "open_url", title: "Read Now"}]
     };
     */
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]

