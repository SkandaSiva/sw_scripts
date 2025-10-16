// v1.1 RELEASE BUILD
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBHn1I9lNo4SxsX5RGUHXbQ4T-bIqFMZkU",
    authDomain: "krepsinisnet-774c9.firebaseapp.com",
    projectId: "krepsinisnet-774c9",
    storageBucket: "krepsinisnet-774c9.appspot.com",
    messagingSenderId: "834720192081",
    appId: "1:834720192081:web:c8501bc1ddefc4b3784a70",
    measurementId: "G-GJBE9F0Y1L"
});

const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(event) {
    var click_action = event.notification.data.click_action || event.notification.data.click_action || event.notification.data || event.data || 'https://www.krepsinis.net/';
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        if (clients.openWindow)
            return clients.openWindow(click_action);
    }));
});

messaging.setBackgroundMessageHandler(function(payload) {
    var click_action = payload.data.click_action|| payload.notification.click_action ||'https://www.krepsinis.net/';
    if (click_action.indexOf('?') === -1) {
        click_action += '?utm_source=pushengage&utm_medium=fcmAPI&utm_campaign=pushengage';
    }

    if(typeof payload.notification !== "undefined") {
        var notificationTitle = payload.notification.title || "krepsinis.net";
        var notificationOptions = {
            body: payload.notification.body,
            image: payload.notification.image,
            icon: 'https://www.krepsinis.net/pimg/Site/ico_for_onesignal.jpg',
            lang: 'lt-LT',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: click_action,
            tag: payload.notification.fcmMessageId || Date.now()
        };
    } else {
        var notificationTitle = payload.data.title || "www.krepsinis.net";
        var notificationOptions = {
            body: payload.data.body,
            icon: payload.data.icon,
            image: payload.data.imgUrl,
            badge: payload.data.badge,
            lang: 'lt-LT',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            data: click_action,
            tag: payload.fcmMessageId || Date.now()
        };
    }
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

