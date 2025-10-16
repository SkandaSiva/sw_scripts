// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBhgjK-d504u7EjaLjboOGmgxjCTUwp0sQ",
    authDomain: "ribbonflowers-63532.firebaseapp.com",
    projectId: "ribbonflowers-63532",
    storageBucket: "ribbonflowers-63532.appspot.com",
    messagingSenderId: "1027028370098",
    appId: "1:1027028370098:web:af005dd75ce708f5777fab",
    measurementId: "G-RXKENYHZRW"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://www.ribbonflowers.com/favicon.png'
    };
    if (payload.notification.image) {
        notificationOptions.image = payload.notification.image;
    }
    self.registration.showNotification(notificationTitle, notificationOptions);
});
