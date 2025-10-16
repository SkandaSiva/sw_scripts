
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyAGX6JmmxLd6Tl01E5Z5DEG5bk9ak8iT-U",
  authDomain: "nadlancenter-b34d2.firebaseapp.com",
  projectId: "nadlancenter-b34d2",
  storageBucket: "nadlancenter-b34d2.appspot.com",
  messagingSenderId: "823780630015",
  appId: "1:823780630015:web:7e51bc95ecc97585321bca",
  measurementId: "G-F0B23HGDDY"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();
 

messaging.setBackgroundMessageHandler(function (payload) {

	console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});