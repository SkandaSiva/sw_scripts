importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');
// FIREBASE CREDENTIALS. Can't use import/importScripts from outside ===>
// Uncaught DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope':
// The script at 'http://localhost:3000/firebase.config.js' failed to load.

const firebaseConfig = {
    apiKey: 'AIzaSyB2ysZ13T8zqH-vM7HNLMo51GftxeHDp-k',
    authDomain: 'spellquiz-test-1590045000405.firebaseapp.com',
    projectId: 'spellquiz-test-1590045000405',
    storageBucket: 'spellquiz-test-1590045000405.appspot.com',
    messagingSenderId: '451229124370',
    appId: '1:451229124370:web:4f59c14469c3f60336d5cb'
};
// const BASE_URL = 'http://localhost:3000'; // local
const BASE_URL = 'https://spellquiz.com'; // production
const SERVER_URL = `${BASE_URL}/pushNotification`;

// initialize
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


/*
    _____We can use Push or firebase 'setBackgroundMessageHandler' handler for display push message
*/
messaging.setBackgroundMessageHandler((payload) => {
    console.log('Payload in background MODE:', payload);
    let notificationTitle = payload.notification.title;
    let notificationOptions = {
        body: payload.notification.body,
        icon: 'https://spellquiz.com/static/clip8.png',
        // options event
        actions: [
            {action: 'confirm', title: '👍 Confirm attendance'},
            {action: 'cancel', title: '👎 Not coming'},
            {action: 'open', title: 'Go now'}
        ],
        // For additional data to be sent to event listeners, needs to be set in this data {}
        data: {confirm: payload.confirm, decline: payload.decline, open: payload.open}
    };

    const promiseChain = clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return self.registration.showNotification(notificationTitle, notificationOptions);
        });
    return promiseChain;
});


/*
    _____Event if SW installed.
*/
self.addEventListener('install', (event) => {
    console.log('Service worker installed: ', event);
    // additional logic, when SW installed
});


/*
    _____This will be called only once when the service worker is activated.
*/
self.addEventListener('activate', async () => {
    console.log('Service worker activated');
    // additional logic, when SW activated
});


/*
    _____Event is used, when device get notification
*/
self.addEventListener('push', function(event) {
    console.log('Received push notification');
    if (event.data) {
        const fcmData = event.data.json();
        console.log('Received push notification data: ', fcmData);
        let notificationTitle = fcmData.notification.title;
        let notificationOptions = {
            body: fcmData.notification.body,
            icon: '/static/cup8.png',
            actions: [
                {action: 'confirm', title: '👍 Confirm attendance'},
                {action: 'cancel', title: '👎 Not coming'},
                {action: 'open', title: 'Go now'}
            ],
            badge: '/static/clip8.png',
            data: {
                confirm: fcmData.data.hasOwnProperty('confirm') ? fcmData.data.confirm : null,
                decline: fcmData.data.hasOwnProperty('decline') ? fcmData.data.decline : null,
                open: fcmData.data.hasOwnProperty('open') ? fcmData.data.open : null,
                pushId: fcmData.data.hasOwnProperty('pushId') ? fcmData.data.pushId : null,
                pushType: fcmData.data.hasOwnProperty('pushType') ? fcmData.data.pushType : 'general',
                meetingId: fcmData.data.hasOwnProperty('meetingId') ? fcmData.data.meetingId : null
            }
        };
        event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
    } else {
        console.log('This push event has no data.');
    }
});


/* 
    _____Event is used, when user click on notification popup
*/
self.addEventListener('notificationclick', (event) => {
    // Event actions derived from event.notification.data from data received
    var eventData = event.notification.data;
    // console.log('Clients notification click handle!!!', event.notification);
    event.notification.close();
    if (event.action === 'confirm' && eventData.confirm) {
        return fetch(`${SERVER_URL}/confirm`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                pushId: event.notification.data.pushId,
                pushType: event.notification.data.pushType,
                meetingId: event.notification.data.meetingId
            })
        });
    } else if (event.action === 'cancel' && eventData.decline) {
        // decline logic
    } else if (event.action === 'open' && eventData.open) {
        clients.openWindow(eventData.open); // push URL
    }
}, false);


/*
    When a pushsubscriptionchange event arrives, indicating that the subscription has expired,
    we resubscribe by calling the push manager's subscribe() method.

    https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event
*/
self.addEventListener('pushsubscriptionchange', (event) => {
    event.waitUntil(self.registration.pushManager.subscribe(event.oldSubscription.options)
        .then((subscription) => {
            console.log('old subscription', subscription);
            return fetch('register', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                }),
            });
        })
        .catch((err) => console.log('err', err))
    );
}, false);
