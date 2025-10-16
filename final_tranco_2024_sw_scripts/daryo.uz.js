/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)

firebase.initializeApp({
    apiKey: "AIzaSyBL9za5WFs-vyMq3ZRL2uniXSvAHPGXMNo",
    authDomain: "daryo-17b1d.firebaseapp.com",
    projectId: "daryo-17b1d",
    storageBucket: "daryo-17b1d.appspot.com",
    messagingSenderId: "411618814653",
    appId: "1:411618814653:web:e3227164bcdb84638ea5d4",
    measurementId: "G-1RJPW6BJVP"
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // console.log(
    //     '[firebase-messaging-sw.js] Received background message ',
    //     payload
    // );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});