// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
/*importScripts('https://www.gstatic.com/firebasejs/7.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.2/firebase-messaging.js');

const messaging = firebase.messaging();*/


// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

var firebaseConfig = {
    apiKey: "AIzaSyCQUrgIiQ9BzcSM-f4erS2yn0GpWdURFEc",
    authDomain: "notificaciones-push-totanacom.firebaseapp.com",
    databaseURL: "https://notificaciones-push-totanacom.firebaseio.com",
    projectId: "notificaciones-push-totanacom",
    storageBucket: "notificaciones-push-totanacom.appspot.com",
    messagingSenderId: "130386044933",
    appId: "1:130386044933:web:80079c7598cea99d9dd46c",
    measurementId: "G-0SSGWQT68C"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


/*firebase.initializeApp({
    'messagingSenderId': '503258159962'
});*/

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]



// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        image: payload.notification.image,
        badge: '/images/logo-totana.png',
        icon: '/images/logo-totana.png',
        data: {
            time: new Date(Date.now()).toString(),
            click_action: payload.notification.click_action
        }
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
/* FUNCIONA SIN ESTO
self.addEventListener('notificationclick', function(event) {
    var action_click = event.notification.data.click_action;
    event.notification.close();

    event.waitUntil(clients.openWindow(action_click));
});*/
// [END background_handler]