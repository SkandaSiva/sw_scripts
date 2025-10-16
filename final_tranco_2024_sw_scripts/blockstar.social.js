importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBXpAebUJ8hbqLnZ7BYs_dW34rFzljRLWQ",
    authDomain: "blockstar-4491a.firebaseapp.com",
    projectId: "blockstar-4491a",
    messagingSenderId: "763601891217",
    appId: "1:763601891217:web:651e274c7ae35e8db3f430",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
});