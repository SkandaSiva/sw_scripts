/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

self.addEventListener('install', function () {
    self.skipWaiting();
});

function initializeFirebase() {
    const firebaseConfig = {"apiKey":"AIzaSyB0l-Xc7SlqH25-joeDj63uMOj1rwodV-8","projectId":"subaru-techshare-stage","messagingSenderId":"524644106660","appId":"1:524644106660:web:6beee4be7ba969adfcc131"}

    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload, ...args) {
        console.log('[Messaging Debug]: Incoming from Service Workier', {
            payload,
            args,
        });

        return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                console.log('[Messaging Debug]: Service Worker posting to window/tab', client);
                client.postMessage(payload);
            }
        });
        // .then(function() {
        //     // show notification on OS if needed
        //     self.registration.showNotification('Test');
        // });
    });
}

initializeFirebase();
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2d776b8d-e493-51b6-a26b-8ba958a39b7f")}catch(e){}}();
//# debugId=2d776b8d-e493-51b6-a26b-8ba958a39b7f
