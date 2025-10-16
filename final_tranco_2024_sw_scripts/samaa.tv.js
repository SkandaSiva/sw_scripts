importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIBF4X9cvDGbKPJ8xADvvTHLORkAHp5PQ",
  authDomain: "sama-push-notification.firebaseapp.com",
  projectId: "sama-push-notification",
  storageBucket: "sama-push-notification.appspot.com",
  messagingSenderId: "1037362093437",
  appId: "1:1037362093437:web:53b9a3e8cf1b3dd338c014",
  measurementId: "G-3P9L033VBW"
};

// Initialize Firebase App in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle incoming messages
messaging.onMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received message ', payload);

  var notificationTitle = payload.notification.title; // Use notification instead of data
  var notificationOptions = {
    body: payload.notification.body, // Use notification instead of data
   icon: '/assets/logo.png',
    data: { url: payload.data.url }, // Ensure URL is in data
    actions: [{ action: "open_url", title: "Read Now" }]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification

    const urlToOpen = event.notification.data.url; // URL from the notification data

    event.waitUntil(
        clients.openWindow(urlToOpen) // Always open a new window with the URL
    );
});
