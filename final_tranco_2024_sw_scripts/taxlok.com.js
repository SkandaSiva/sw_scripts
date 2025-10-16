importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBu3vDmY8wJn_IOD4w-WLYlHVea4H6rs9I",
  authDomain: "demowebnotification-fc61a.firebaseapp.com",
  projectId: "demowebnotification-fc61a",
  storageBucket: "demowebnotification-fc61a.appspot.com",
  messagingSenderId: "969326084500",
  appId: "1:969326084500:web:5440caf87d7f6c8ab3cf81"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message: ', payload);

    var notificationData = JSON.parse(payload.data.notification);

    var notificationTitle = notificationData.title;
    var notificationOptions = {
        body: notificationData.body,
        icon: notificationData.icon,
        image: notificationData.image,
        actions: notificationData.actions,
        requireInteraction: true  // Keeps the notification visible until user interaction
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    var action = event.action;
    if (action === 'visit-site') {
        clients.openWindow('https://www.taxlok.com');
    } else {
        clients.openWindow('/');
    }
    event.notification.close();
});

//// In your firebase-messaging-sw.js or main JavaScript file
//self.addEventListener('push', function (event) {
//    var data = event.data.json();
//    console.log('Received push event', data);
//    var options = {
//        body: data.notification.body,
//        icon: data.notification.icon || 'https://www.taxlok.com/images/taxlok.png' // Provide a default icon if payload doesn't include one
//    };
//    event.waitUntil(self.registration.showNotification(data.notification.title, options));
//});