importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging-compat.js');
// Compat scripts are firebase v8 style (https://github.com/firebase/firebase-js-sdk/issues/5732)

var firebaseConfig = {
  apiKey: "AIzaSyCEB61CX_yCqs1o43hwkwm6j605zlfb-JY",
  authDomain: "netsocdateregularprod.firebaseapp.com",
  databaseURL: "https://netsocdateregularprod.firebaseio.com",
  projectId: "netsocdateregularprod",
  storageBucket: "netsocdateregularprod.appspot.com",
  messagingSenderId: "423060889807",
  appId: "1:423060889807:web:7aae5eabd39456b55217ba",
  measurementId: "G-3NR2R0NLSH"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
//console.log("service worker deployed");

messaging.onBackgroundMessage(function(payload) {
  console.log('Firebase background message received', payload);
  const notificationTitle = payload.data.title;

  const notificationOptions = {
    tag: payload.data.tagName,
    body: payload.data.body,
    data: payload.data.clickURL,
    icon: payload.data.largeIcon,
    badge: "https://www.ona-on.com/app/resources/regular/images/notifBadgeIcon.png",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = decodeURIComponent(event.notification.data);
  event.waitUntil(self.clients.openWindow(url));
});
