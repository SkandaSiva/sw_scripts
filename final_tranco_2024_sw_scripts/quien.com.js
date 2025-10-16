// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js');
//importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js');
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyB1V6fyXf9X78jfzAfiJlOnEiQJKAN6dZM",
  authDomain: "expansion-live-v2.firebaseapp.com",
  projectId: "expansion-live-v2",
  storageBucket: "expansion-live-v2.appspot.com",
  messagingSenderId: "463925564676",
  appId: "1:463925564676:web:734cee1fbab82303bbec51",
  measurementId: "G-GF9ETF78BK"
});
//firebase.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
//firebase.appCheck().activate('C69D6B52-8645-493F-BF3D-290C3FC456A1');
console.log('[firebase-messaging-sw.js] and analytics Loading...');
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

const messaging = firebase.messaging();

var url =  "";

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] V49 Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url:payload.data.click_action }
  };
  url = payload.data.click_action;
  console.log('notificationTitle',notificationTitle);
  console.log('notificationOptions',notificationOptions);

  self.registration.showNotification(notificationTitle,
          notificationOptions);
});
