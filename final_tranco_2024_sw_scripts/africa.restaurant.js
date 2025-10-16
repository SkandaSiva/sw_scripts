/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyC_Wes7JJUZKCoX5bgSRWMSfl31BIeE9_U',
  authDomain: 'starkitchen-messaging.firebaseapp.com',
  projectId: 'starkitchen-messaging',
  storageBucket: 'starkitchen-messaging.appspot.com',
  messagingSenderId: '105981795433',
  appId: '1:105981795433:web:efa7479299f34e7e5a16f8',
  measurementId: 'G-Y0FRJQZXVH',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler((payload) => {
//   // console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.body,
//     icon: '/images/orda-icon.png',
//   };
//   // eslint-disable-next-line no-restricted-globals
//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });

// // eslint-disable-next-line no-restricted-globals
// self.addEventListener(
//   'notificationclick',
//   (event) =>
//     // console.log(event);
//     event
// );

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();

  messaging.onMessage((message) => {
    const {
      notification: { title, body, image },
    } = message;
    // eslint-disable-next-line no-restricted-globals
    self?.registration?.showNotification(title, {
      body,
      icon: image || '/images/orda-icon.png',
    });

    // eslint-disable-next-line no-restricted-globals
    self?.addEventListener('notificationclick', (event) => {
      event.notification.close();
      // eslint-disable-next-line no-restricted-globals
      event.waitUntil(self.clients.openWindow(event.notification.data));
    });
  });

  messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
    // eslint-disable-next-line no-restricted-globals
    self?.registration?.showNotification(title, {
      body,
      icon: image || '/images/orda-icon.png',
    });
  });
}
