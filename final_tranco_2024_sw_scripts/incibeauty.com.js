importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCHI6TfVGJh57NlZARtpNR4JoL7J9twK6s",
    authDomain: "ib-web-push.firebaseapp.com",
    projectId: "ib-web-push",
    storageBucket: "ib-web-push.appspot.com",
    messagingSenderId: "36338792813",
    appId: "1:36338792813:web:f79b6bb4ef74cb62f6c264",
    measurementId: "G-X422FD09C2"
});

self.addEventListener('notificationclick', function (event) {
    if (event.notification && event.notification.data && event.notification.data.FCM_MSG && event.notification.data.FCM_MSG.notification) {
        const url = event.notification.data.FCM_MSG.notification.click_action;

        if (self.clients.openWindow) {
            return self.clients.openWindow(url);
        }
    }
})

const messaging = firebase.messaging();