// [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
    apiKey: "AIzaSyC3SZ1B4N87Zt_axvEXLcY3ujrOkUBb9bw",
    authDomain: "ematic-firebase-production.firebaseapp.com",
    //databaseURL: "https://...webpush.firebaseio.com",
    projectId: "ematic-firebase-production",
    storageBucket: "ematic-firebase-production.appspot.com",
    messagingSenderId: "966420770907",
    appId: "1:966420770907:web:893cb87560b31a85e34f7e",
    measurementId: "G-PBLNPFJ1TL"
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
/*
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
    click_action: 'https://firebase.com',
    tag : 'iterable',
    requireInteraction: true
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
});
*/

self.addEventListener("notificationclick", function(event) {
    const clickedNotification = event.notification;
    
    var options = {
      body: event.notification.body,
      icon: event.notification.icon,
      click_action: event.notification.actions[0].action,
      data: {
        click_action: event.notification.actions[0].action
      },
      type: event.type
    };
    
    
    event.waitUntil(self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function (all) {
            for (var i=0; i < all.length; i++) {
            if (all[i].focused === true || all[i].visibilityState === "visible") {
              all[i].postMessage(JSON.stringify(options));
              self.clients.openWindow( event.notification.actions[0].action)
              break;
            }
        }

    },function(err) {}));
    
});
     
// [END background_handler]