importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAlaGxRMkFkBYEXW9Selc8_nrX_81KU1hw",
    authDomain: "kommersantsite.firebaseapp.com",
    databaseURL: "https://kommersantsite.firebaseio.com",
    projectId: "kommersantsite",
    storageBucket: "kommersantsite.appspot.com",
    messagingSenderId: "635839491665",
    appId: "1:635839491665:web:00f1d6a3d9d3e96b9c9270"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    payload.data.data = JSON.parse(JSON.stringify(payload.data));
    return self.registration.showNotification(payload.data.title, payload.data);
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();

    if (event.notification.data && event.notification.data.click_action) {

        const url = event.notification.data.click_action;

        event.waitUntil(clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        }).then(function (windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                let client = windowClients[i];
                if (client.url === url && "focus" in client) return client.focus()
            }
            return clients.openWindow ? clients.openWindow(url) : 0;
        }));
    }
});
