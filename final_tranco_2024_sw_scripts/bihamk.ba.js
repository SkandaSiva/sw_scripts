importScripts('https://www.gstatic.com/firebasejs/7.11.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.11.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA9WyHku5GGM-TnPY7qnskJ6clNpVyKu0A",
    authDomain: "bihamk-a671f.firebaseapp.com",
    projectId: "bihamk-a671f",
    storageBucket: "bihamk-a671f.appspot.com",
    messagingSenderId: "738125117065",
    appId: "1:738125117065:web:993ec67c699bf141343858"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const {title, ...options} = payload.notification;
    
    return self.registration.showNotification(title, options);
});