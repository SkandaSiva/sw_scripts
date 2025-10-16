importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')
firebase.initializeApp({
  apiKey: "AIzaSyAYWKD97GPog9cXGyqULYhmlXtSiCGLWls",
  authDomain: "exchmarket-f3775.firebaseapp.com",
  projectId: "exchmarket-f3775",
  storageBucket: "exchmarket-f3775.appspot.com",
  messagingSenderId: "906078760048",
  appId: "1:906078760048:web:2d15a42be43cea7c7298b5",
  measurementId: "G-6KH3E510CC"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || '';
  const notificationOptions = {
    body: payload.notification.body || '',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  this.openData(payload)
});
messaging.onMessage((payload) => {
  const notificationTitle = payload.notification.title || '';
  const notificationOptions = {
    body: payload.notification.body || '',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
function openData(payload) {
  self.addEventListener('notificationclick', function (payloads) {
    if (payloads) {
      const link = payload.fcmOptions.link;
      if (link) {
        payload.waitUntil(clients.openWindow(link));
      }
    }
  });
}
