importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const FCM_SERVICE_WORKER_VERSION = '0.0.4';

self.addEventListener("install", (event) => {
    self.skipWaiting();
    console.log('[WEBPUSH SW] - install', FCM_SERVICE_WORKER_VERSION);
});

self.addEventListener("activate", (event) => {
    console.log('[WEBPUSH SW] - activate', FCM_SERVICE_WORKER_VERSION);
    self.skipWaiting();
});

self.addEventListener("push", (event) => {
    console.log('[WEBPUSH SW] - push', FCM_SERVICE_WORKER_VERSION);
    // event.currentTarget.registration.update().then(() => {
    //     console.log('Registration wersion updated', FCM_SERVICE_WORKER_VERSION, event.data.json());
    // });
});

self.addEventListener('notificationclick', function(event) {
    console.log('[WEBPUSH SW] notificationClick', FCM_SERVICE_WORKER_VERSION, event.notification);

    if (event.notification.data['FCM_MSG'] !== undefined) {
        const { FCM_MSG } = event.notification.data;
        const fcmMsgUrl = new URL(FCM_MSG.notification.click_action);
        const notificationUrl = fcmMsgUrl.pathname === '' ? fcmMsgUrl.origin + '/' : fcmMsgUrl.toString();

        event.notification.close();
        event.waitUntil(
            clients.matchAll({
                type: "window"
            })
            .then(function(clientList) {
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i];
                    if (client.url === notificationUrl && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(fcmMsgUrl);
                }
            })
        );
    } else {
        console.log('[WEBPUSH SW] notificationclick - url is not defined');
    }
});

firebase.initializeApp({
    apiKey: "AIzaSyC3H50VT-npB1kDawnVdGf3FbwTpCKREKo",
    authDomain: "rp-web-prod.firebaseapp.com",
    projectId: "rp-web-prod",
    storageBucket: "rp-web-prod.appspot.com",
    messagingSenderId: "86281093702",
    appId: "1:86281093702:web:cc00aff3c55c3177224047",
    measurementId: "G-MSDQ70DDR9",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    console.log(
        "[WEBPUSH SW] Received background message ",
        FCM_SERVICE_WORKER_VERSION,
        payload,
    );
    // if (navigator.appVersion.indexOf("Edg") > -1) {
    //     console.log('Only for edge');
    //     const title = payload.notification.title;
    //     const options = {
    //         body: payload.notification.body,
    //         icon: 'https://statics.rp.pl/apple-touch-icon-120x120.png?aver=c7a19164',
    //         image: payload.notification.image
    //     };
    //     return self.registration.showNotification(
    //         title,
    //         options,
    //     );
    // }
});