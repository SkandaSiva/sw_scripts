importScripts("./firebase-app.js");
importScripts("./firebase-messaging.js");
importScripts("./firebase-config.js");

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const notification = JSON.parse(payload);
  const notificationOption = {
    body: notification.body,
    icon: notification.icon,
  };
  return self.registration.showNotification(
    payload.notification.title,
    notificationOption
  );
});
