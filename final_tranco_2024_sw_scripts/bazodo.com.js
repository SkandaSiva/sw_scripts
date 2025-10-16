importScripts(
    "https://www.gstatic.com/firebasejs/9.9.3/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.9.3/firebase-messaging-compat.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDEjPg6dN2vGBPkUr9Ur9pcnMeL28V2mmA",
    authDomain: "bazodo-green.firebaseapp.com",
    databaseURL: "https://bazodo-green.firebaseio.com",
    projectId: "bazodo-green",
    storageBucket: "bazodo-green.appspot.com",
    messagingSenderId: "1089637188997",
    appId: "1:1089637188997:web:ac64d19f7cedf1ccd9b0ec",
    measurementId: "G-YM8ZXRXH9H",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const { title, body, image, icon, ...restPayload } = payload.data;
    const notificationOptions = {
        body,
        icon: image || '/images/icons/icon-192x192.png',
        data: restPayload,
    };
    return self.registration.showNotification(title, notificationOptions);
});