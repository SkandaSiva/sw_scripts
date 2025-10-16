// // Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR5LJSwGWXOP9oEVDMk-vkcj40SydqraE",
    authDomain: "prva-rs-push.firebaseapp.com",
    projectId: "prva-rs-push",
    storageBucket: "prva-rs-push.appspot.com",
    messagingSenderId: "846651474743",
    appId: "1:846651474743:web:2c8e921576b42851fb50b2"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    // console.log('new notification', payload);
    var notificationTitle = payload.data.title;
    var notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
        data:{
            url: payload.data.url
        }
    };
    
return self.registration.showNotification(notificationTitle,
    notificationOptions);
}); 

self.addEventListener('notificationclick', function(event) {
    // console.log('click event', event.notification);
    var data = event.notification.data;
    // console.log(data.url);
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
//      for (var i = 0; i < clientList.length; i++) {
//        var client = clientList[i];
//        if (client.url == data.url && 'focus' in client)
//          return client.focus();
//      }
      if (clients.openWindow)
        return clients.openWindow(data.url);
    }));
});

self.addEventListener('install', function(e) {self.skipWaiting()});
self.addEventListener('activate', function() {self.clients.claim()});