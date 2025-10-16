importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

/**
 * Push notification even click
 */
self.addEventListener('notificationclick', function (event) {
  const data = event.notification.data.FCM_MSG.data;
  const winClients = clients;

  event.notification.close();
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
      let found = false;

      clients.every((client) => {
        if (client.url.includes(data.url)) {
          found = true;
          client.focus();
          client.postMessage(data);
          return false;
        }

        return true;
      });

      if (!found) {
        winClients.openWindow(data.url);
      }
    })
  );
});

const firebaseApp = firebase.initializeApp({
  projectId: 'klapp-b09c5',
  appId: '1:238679797152:web:2388c4ef8c979162dd08c5',
  databaseURL: 'https://klapp-b09c5.firebaseio.com',
  storageBucket: 'klapp-b09c5.appspot.com',
  locationId: 'us-central',
  apiKey: 'AIzaSyDSLoynC8CkplNRmMQMrsQkn8MijFEeZNA',
  authDomain: 'klapp-b09c5.firebaseapp.com',
  messagingSenderId: '238679797152',
  measurementId: 'G-G7XW229G4X',
});

const messaging = firebase.messaging(firebaseApp);

/**
 * On background notification
 */
messaging.onBackgroundMessage((payload) => {
  const url = payload.data.url;
  clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    clients.every((client) => {
      if (client.url.includes(url)) {
        client.postMessage(payload.data);
      }
    });
  });
});
