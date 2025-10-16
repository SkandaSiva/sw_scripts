const handle = event => {
  const notification = event.notification;
  const action = event.action;
  const data = event.notification.data;

  if (action !== 'close') {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if ("focus" in client) {
              try {
                client.postMessage({
                  action: 'notificationclick-sw',
                  data,
                });
                return client.focus();
              } catch (e) {
                console.error(e);
              }
            }
          }

          const hostname = self.location.hostname;
          let domain = null;

          switch (hostname) {
            case 'localhost':
              domain = 'http://localhost:3002'
              break;
            case 'preprod.donnons.org':
              domain = 'https://preprod.donnons.org'
              break;
            case 'donnons.org':
              domain = 'https://donnons.org'
              break;
            default:
              break;
          }

          clients.openWindow(`${domain}/notifications-web?data=${JSON.stringify(data)}`);
        }),
    );
  }

  // close notification after click
  notification.close();
}

self.addEventListener('notificationclick', handle);

importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

__WB_DISABLE_DEV_LOGS = true

const firebaseConfig = {
  apiKey: "AIzaSyAB0h4hBqKxP_NMFS4vgMmhNDQwyRPWBMo",
  authDomain: "donnons-push.firebaseapp.com",
  projectId: "donnons-push",
  storageBucket: "donnons-push.appspot.com",
  messagingSenderId: "9496264515",
  appId: "1:9496264515:web:5769f2041fd16e845079f6",
  measurementId: "G-2ZMYVMXHDY"
};

firebase.initializeApp(firebaseConfig);

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload,
    );

    // https://firebase.google.com/docs/cloud-messaging/concept-options?hl=fr#notifications_and_data_messages
    if (!payload.notification) {
      const options = {
        body: payload.notification.body,
        vibrate: [100, 50, 100],
        collapseKey: 'global',
        data: payload.data,
      }
      
      self.registration.showNotification(payload.notification.title, options);
    }
  });
}
