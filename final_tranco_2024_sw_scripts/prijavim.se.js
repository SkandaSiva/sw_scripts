// this file must be in root folder
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')

const firebaseConfig = {
    apiKey: "AIzaSyBRUqLev7BFrCMRInSfzS3QT5n7zCvIk1E",
    authDomain: "prijavim-se-push-notification.firebaseapp.com",
    projectId: "prijavim-se-push-notification",
    storageBucket: "prijavim-se-push-notification.appspot.com",
    messagingSenderId: "225396723094",
    appId: "1:225396723094:web:dafb1e978d375ecb94a1b7"
};

// receiving messages in background
const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

// get this type of message in background
messaging.onBackgroundMessage(function (payload) {
    if (!payload.hasOwnProperty('notification')) {
        const notificationTitle = payload.data.title
        const notificationOptions = {
            body: payload.data.body,
            icon: payload.data.icon,
            image: payload.data.image
        }
        self.registration.showNotification(notificationTitle, notificationOptions);
        self.addEventListener('notificationclick', function (event) {
            const clickedNotification = event.notification
            clickedNotification.close();
            event.waitUntil(
                clients.openWindow(payload.data.click_action)
            )
        })
    }
})