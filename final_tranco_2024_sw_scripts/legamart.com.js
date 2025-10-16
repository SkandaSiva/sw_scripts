importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js'
);

const uatFirebaseConfig = {
  apiKey: 'AIzaSyC9pwVRrQ9nEvRy2EaMRFyjZjEqZKNNlFw',
  authDomain: 'legamart-uat.firebaseapp.com',
  projectId: 'legamart-uat',
  storageBucket: 'legamart-uat.appspot.com',
  messagingSenderId: '115315168023',
  appId: '1:115315168023:web:c7d38e8e0edba9753c9d52',
  measurementId: 'G-V5DM272K5P',
};

const productionFirebaseConfig = {
  apiKey: 'AIzaSyCSpWUY9y-ewc48UW72JLN7Wd38K6wmbdQ',
  authDomain: 'legamart-b1240.firebaseapp.com',
  projectId: 'legamart-b1240',
  storageBucket: 'legamart-b1240.appspot.com',
  messagingSenderId: '451668839709',
  appId: '1:451668839709:web:c213ebf942a5e59ac125f4',
  measurementId: 'G-SFPK4L1EZH',
};

// Initialize Firebase
firebase.initializeApp(productionFirebaseConfig);

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function (payload) {
    self.registration.showNotification(
      payload?.notification?.title || 'Legamart',
      {
        body: payload?.notification?.body || 'You have a new message',
        icon: payload?.notification?.image || '/favicon.png',
      }
    );
  });
  self.addEventListener('notificationclick', function (event) {
    const promiseChain = self.clients.openWindow('legamart.com');
    event.waitUntil(promiseChain);
  });
}
