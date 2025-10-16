// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDQEbIAAFc79x0g79fq3wtI20Xot_2ChYM", // replace with your API key
  authDomain: "imco-cb3bf.firebaseapp.com",
  databaseURL: "https://imco-cb3bf.firebaseio.com",
  projectId: "imco-cb3bf",
  storageBucket: "imco-cb3bf.appspot.com",
  messagingSenderId: "738935566320",
  appId: "1:738935566320:web:11799c6b36f634dbb13735"
});

// Retrieve Firebase Messaging
const messaging = firebase.messaging();

// Background message handler for Firebase
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    tag: payload.notification.tag,
    requireInteraction: true,
    data: {
      // Ensure `click_action` is part of data
      click_action: payload.data.click_action || ''
    }
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const clickAction = event.notification.data.click_action;
  
  // Handle notification click and open the URL in a new tab
  if (clickAction) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickAction);
        }
      })
    );
  }
});
