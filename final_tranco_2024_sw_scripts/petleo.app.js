importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js");

//Using singleton breaks instantiating messaging()
// App firebase = FirebaseWeb.instance.app;


firebase.initializeApp({
        apiKey: "AIzaSyDz-XSOuUeBo5fhQybX78tvVv-MfwUZILc",
        authDomain: "petleo-compose.firebaseapp.com",
        databaseURL: "https://petleo-compose.firebaseio.com",
        projectId: "petleo-compose",
        storageBucket: "petleo-compose.appspot.com",
        messagingSenderId: "151458785896",
        appId: "1:151458785896:web:97f98bfb7d1d3c592629dd",
        measurementId: "G-M9N59S0BLD"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
        const promiseChain = clients
                .matchAll({
                        type: "window",
                        includeUncontrolled: true
                })
                .then(windowClients => {
                        for (let i = 0; i < windowClients.length; i++) {
                                const windowClient = windowClients[i];
                                windowClient.postMessage(payload);
                        }
                })
                .then(() => {
                        return registration.showNotification("New Message");
                });
        return promiseChain;
});
self.addEventListener('notificationclick', function (event) {
        console.log('notification received: ', event)
});