// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup

importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyBk9etPb9VuCNwU1YLpc0BWFTIL7JWTPlA",
    authDomain: "push-notifn.firebaseapp.com",
    databaseURL: "https://push-notifn.firebaseio.com",
    projectId: "push-notifn",
    storageBucket: "push-notifn.appspot.com",
    messagingSenderId: "856756086450",
    appId: "1:856756086450:web:69a8cf9cf2840dca704bab",
    measurementId: "G-9T800JFR5Q"
  };
  firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.

 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
   apiKey: 'api-key',
   authDomain: 'project-id.firebaseapp.com',
   databaseURL: 'https://project-id.firebaseio.com',
   projectId: 'project-id',
   storageBucket: 'project-id.appspot.com',
   messagingSenderId: 'sender-id',
   appId: 'app-id',
   measurementId: 'G-measurement-id',
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 **/


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image,
    icon:'/nero-com-wGlobal/wGlobal/layout/scripts/push-notfn/nero_white.png',
    click_action: payload.data.click_action,
    data: {
  click_action: payload.data.click_action
    }

  };
   
self.addEventListener('notificationclick', function(event) {
console.log(event.notification.data.click_action);
if (!event.action) {
// Was a normal notification click
console.log('Notification Click.');
self.clients.openWindow(event.notification.data.click_action, '_blank')
event.notification.close();
return;
}else{
event.notification.close();
}
});

  return self.registration.showNotification(notificationTitle,
    notificationOptions);


});