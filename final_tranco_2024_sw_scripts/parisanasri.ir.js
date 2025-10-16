self.addEventListener('install', function (event) {
    console.log('Service Worker is being installed.');
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker is being activated.');
});
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");


const firebaseConfig = {
    apiKey: "AIzaSyALAT396boicoVCT7LhHu7q5Ywb_5sQWU8",
    authDomain: "parisanasri-ir.firebaseapp.com",
    projectId: "parisanasri-ir",
    storageBucket: "parisanasri-ir.appspot.com",
    messagingSenderId: "618552700992",
    appId: "1:618552700992:web:9887f977c1990229312fa5",
    measurementId: "G-JY9X8JGN4J"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();



self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    console.log('Notification notificationclick triggered');
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == self.registration.scope && 'focus' in client) {
                return client.focus();
            }
        }
        const data = event.data.json();
        if (clients.openWindow) {
            return clients.openWindow(data.data.url);
        }
    }));
});