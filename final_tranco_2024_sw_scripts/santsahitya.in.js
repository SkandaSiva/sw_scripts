importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');
/*Update this config*/
var config = {
    apiKey: "AIzaSyCVSf0KpbsNHAVkM5kd0KE7A5zHhllwBRI",
    authDomain: "sant-sahitya-in.firebaseapp.com",
    databaseURL: "https://cloud815.thundercloud.uk:2083/cpsess0901098503/3rdparty/phpMyAdmin/index.php?route=/sql&pos=0&db=kkteamin_agrokranti&table=tbl_sant_tokens",
    projectId: "sant-sahitya-in",
    storageBucket: "sant-sahitya-in.appspot.com",
    messagingSenderId: "822913693842",
    appId: "1:822913693842:web:3e933148a82ce74ead4e4b",
    measurementId: "G-7XRGC2NSV5"
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