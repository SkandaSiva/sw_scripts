importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyBP05LYQbLsDUdMH0gazmeTimh2FtPSOEE",
    authDomain: "showzone-cloud.firebaseapp.com",
    projectId: "showzone-cloud",
    storageBucket: "showzone-cloud.appspot.com",
    messagingSenderId: "222135332429",
    appId: "1:222135332429:web:b56d44caffbf0b1b8c7604",
})

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'https://content.showzone.gg/wp-content/uploads/2023/03/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});