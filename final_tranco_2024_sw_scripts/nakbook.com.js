importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');
/*Update this config*/
var config = {
    apiKey: "AIzaSyDS7dyYFr4ALbAfv8c0cfyJnqaiYD8xhG4",
  authDomain: "nakbook-f5808.firebaseapp.com",
  projectId: "nakbook-f5808",
  storageBucket: "nakbook-f5808.appspot.com",
  messagingSenderId: "32002150423",
  appId: "1:32002150423:web:e6c9dedf3c87a5d7460c52"
  };
  firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
	body: payload.data.body,
        icon: payload.data.icon
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
// [END background_handler]