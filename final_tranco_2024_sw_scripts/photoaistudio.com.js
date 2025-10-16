// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBqFdfnwFd_GCklqb6xH4Y74kiekBmtr9Q',
  authDomain: 'photoaistudio-catio.firebaseapp.com',
  projectId: 'photoaistudio-catio',
  storageBucket: 'photoaistudio-catio.appspot.com',
  messagingSenderId: '940256361938',
  appId: '1:940256361938:web:5392f8488d92fa77239c0b',
  measurementId: 'G-R2HPY4J4GZ',
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './structure/logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener('notificationclick', function (event) {
    event.notification.close(); // Close the notification
    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then(function (windowClients) {
          for (let i = 0; i < windowClients.length; i++) {
            let client = windowClients[i];
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(self.location.origin);
          }
        })
    );
  });
});
