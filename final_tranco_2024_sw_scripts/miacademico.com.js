/**
 * Created by serviestudios on 29/06/20.
 */
//importScripts('bower_components/firebase/firebase-app.js');
//importScripts('bower_components/firebase/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');


const firebaseConfig = {
    apiKey: "AIzaSyBmutGGNnkA653wPLFsxi6bPLo1w6yRsYE",
    authDomain: "academicoec-e8e00.firebaseapp.com",
    databaseURL: "https://academicoec-e8e00.firebaseio.com",
    projectId: "academicoec-e8e00",
    storageBucket: "academicoec-e8e00.appspot.com",
    messagingSenderId: "190835652144",
    appId: "1:190835652144:web:8c12251de9823528",
    measurementId: "G-3BC2E7ZJEB"


};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
//messaging.usePublicVapidKey('BOjUZ-TO6V2yZSA7AaLDKtdjgjb2hpH5-OQaIvXFWTQJhFnzMKw_M42QTtClDkbF5bqHcNMUB-QIEOSszEeQ0uc');
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-v2.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/media/ico.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
self.addEventListener('notificationclick', (event) => {
    if (event.action) {
        //clients.openWindow(event.action);
        console.log("cliente notificaciones");
    }
    event.notification.close();
});