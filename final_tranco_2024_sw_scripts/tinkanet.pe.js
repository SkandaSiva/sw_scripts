
// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyA_bkdDZUx36se1AkzbxdpHJjRq7q3XIWQ",
  authDomain: "tinkanet-1b9cd.firebaseapp.com",
  projectId: "tinkanet-1b9cd",
  storageBucket: "tinkanet-1b9cd.appspot.com",
  messagingSenderId: "441181924743",
  appId: "1:441181924743:web:d0f24311a5991e1c627722"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    image: payload.data.image,
    data: {
      time: new Date(Date.now()).toString(),
      click_action: payload.data.click_action,
    }
  };
  this.registration.showNotification(notificationTitle, notificationOptions);
});



// [END background_handler]
// https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow
self.addEventListener('notificationclick', function (event) {

  event.notification.close();
  const url = event.notification.data.click_action;
  const urlToOpen = new URL(url, self.location.origin).href;
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((clientsArr) => {
      const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === urlToOpen ? (windowClient.focus(), true) : false);
      if (!hadWindowToFocus) {
        clients.openWindow(urlToOpen).then(windowClient => windowClient ? windowClient.focus() : null);
      }
    });
  event.waitUntil(promiseChain);

})
