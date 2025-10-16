importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
   'messagingSenderId': '1086293657530'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'mykundali.com';
  const notificationOptions = {
    body: 'Welcome to Mykundali',
    icon: '/images/mykundali-touch-icon-96.png'

  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

self.addEventListener('fetch', function (event) { });