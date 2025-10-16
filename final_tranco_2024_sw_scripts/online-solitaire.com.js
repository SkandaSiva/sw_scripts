importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBHzWV5FPMMbZdmwusHaY2AP2gFNdITclk",
  authDomain: "online-solitaire.firebaseapp.com",
  databaseURL: "https://online-solitaire.firebaseio.com",
  projectId: "online-solitaire",
  storageBucket: "gs://online-solitaire.appspot.com",
  messagingSenderId: "472904605149",
  appId: "1:472904605149:web:b8f65dcd89820e75702a34"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {  
  const notificationTitle = payload.data.title || 'Daily challenge available';
  const notificationOptions = {
    body: payload.data.body || 'Complete challenge to keep your streak alive!',
    icon: '/images/android-chrome-192x192.png',
    data: {
      url: payload.data.click_action || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {

  event.notification.close();

  const clickAction = event.notification.data.url || '/';

  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === clickAction && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow) {
      return clients.openWindow(clickAction);
    }
  }));
});
