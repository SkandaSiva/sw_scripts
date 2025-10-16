importScripts('/firebase/8.4.1/firebase-app.js');
importScripts('/firebase/8.4.1/firebase-messaging.js');

const isDevEnv = self.location.hostname.includes('localhost') || self.location.hostname.includes('dev');

self.addEventListener('notificationclick', (event) => {
    console.debug('SW notification click event', event);
    if (event.notification.data) {
        const url = event.notification.data.FCM_MSG.notification.click_action;
        event.waitUntil(clients.matchAll({type: 'window'}).then((windowClients) => {
            // check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // if not, then open the target URL in a new window/tab
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        }));
    }
});

const firebaseConfigDev = {
    apiKey: "AIzaSyDb8XAf6l0srXEC8vVqTEQoFZf7YobyWag",
    authDomain: "mysale-android-firebase.firebaseapp.com",
    databaseURL: "https://mysale-android-firebase.firebaseio.com",
    projectId: "mysale-android-firebase",
    storageBucket: "mysale-android-firebase.appspot.com",
    messagingSenderId: "387103789802",
    appId: "1:387103789802:web:ed388ec2d32fe81e08fd93"
};
const firebaseConfigProd = {
    apiKey: "AIzaSyAJyOCBhoRmfmDfifDKDTtPP1D7MYRHqvc",
    authDomain: "deals-direct.firebaseapp.com",
    databaseURL: "https://deals-direct.firebaseio.com",
    projectId: "deals-direct",
    storageBucket: "deals-direct.appspot.com",
    messagingSenderId: "135798231877",
    appId: "1:135798231877:web:7c1cc6a36ddd5b110ce42c",
    measurementId: "G-V8TWVB72LN"
};
const firebaseConfig = isDevEnv ? firebaseConfigDev : firebaseConfigProd;
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/* messaging.onBackgroundMessage((payload) => {
    console.debug('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const { title, ...options } = payload.notification;
    const currentUrlProtocol = self.location.host.includes('localhost') ? 'http' : 'https';
    const clickAction = `${currentUrlProtocol}://${self.location.host}`;
    const notificationOptions = {
        ...options,
        click_action: clickAction,
        icon: 'https://c1.mysalec.com/icons/webpush-default-topbuy.png'
    };
    self.registration.showNotification(title, notificationOptions);
}); */