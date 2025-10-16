// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAzXZ8rLJHgYL1rDO4W9XnN88lhVUKvXQU",
    authDomain: "push-server-93abb.firebaseapp.com",
    projectId: "push-server-93abb",
    storageBucket: "push-server-93abb.appspot.com",
    messagingSenderId: "910303239399",
    appId: "1:910303239399:web:9fca839a9f69f537a41642",
    measurementId: "G-GC5HD6V3QG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle push event
self.addEventListener('push', function(event) {
  console.log('Push event received', event);

  const payload = event.data.json();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    image: payload.notification.image, 
    data: { click_action: payload.notification.click_action } // Add click_action to data
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const clickAction = event.notification.data.click_action;
  event.waitUntil(
    clients.openWindow(clickAction)
  );
});
