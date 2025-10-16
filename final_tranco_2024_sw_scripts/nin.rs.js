// // // Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js');

// Your web app's Firebase configuration
var firebaseConfig = {
      apiKey: "AIzaSyCzJFn0wY9pt8V7p3TCqDuVu5iroSvLqvE",
      authDomain: "nin-development-7d29c.firebaseapp.com",
      projectId: "nin-development-7d29c",
      storageBucket: "nin-development-7d29c.appspot.com",
      messagingSenderId: "835322442184",
      appId: "1:835322442184:web:1e3b92631381e3c6de50fd"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('new notification', payload);
    urlToClick = payload.data.url;
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
    console.log('click event', event.notification);
    var data = event.notification.data;
    console.log(data.url);
    event.notification.close();
    event.waitUntil(clients.matchAll({
      type: 'window'
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == data.url && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow(data.url);
    }));
});

self.addEventListener('install', function(e) {self.skipWaiting()});
self.addEventListener('activate', function() {self.clients.claim()});