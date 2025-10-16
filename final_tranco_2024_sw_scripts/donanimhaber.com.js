// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.


importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js');

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC1cDAdCq8Kwy-ZIHqKlG_l-vpysOJark4",
    authDomain: "dhmobile-389e9.firebaseapp.com",
    databaseURL: "https://dhmobile-389e9.firebaseio.com",
    projectId: "dhmobile-389e9",
    storageBucket: "dhmobile-389e9.appspot.com",
    messagingSenderId: "634101234150",
    appId: "1:634101234150:web:998a23b57c1cd0578abe27",
    measurementId: "G-BHH966J1CZ"
};

const webversion = 'v3.5';

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

self.addEventListener('error', function (e) {
    console.log('event error ', e);
    fetch("/Api/NewsNotifications/Log?id=-1&token=&type=4&message=service-worker error event onclick " + webversion + " -> " + e.message);
});

self.addEventListener('notificationclick', function (event) {
    var notificationId = 0;
    var token = '';

    try {
        var payload = event.notification.data;
        payload.data.url = payload.data.url.trim() == '' ? 'www.donanimhaber.com' : payload.data.url;

        notificationId = payload.data.recordId;
        token = payload.data.token;

        //click log
        //fetch("/Api/NewsNotifications/Log?id=" + notificationId + "&token=" + token + "&type=3&message=service-worker " + webversion)
        //    .then(function (response) {
        //        console.log('click fetch response ', response);

        //        console.log('response data ', response.text());

        //    })
        //    .catch(function (err) {
        //        console.log('fetch error ', err);
        //    });

        if (typeof (payload.data.url) != 'undefined') {
            event.waitUntil(
                self.clients.matchAll({
                    type: "window"
                })
                    .then(function () {
                        if (self.clients.openWindow) {
                            console.log('open window ', payload);
                            return self.clients.openWindow(payload.data.url);
                        }
                    })
            );
        }

        event.notification.close();
    } catch (e) {
        console.log('custom exception ', e);
        fetch("/Api/NewsNotifications/Log?id=" + notificationId + "&token=" + token + "&type=4&message=service-worker " + webversion + " -> " + e.message);
    }
});

messaging.setBackgroundMessageHandler(showNotification);

function showNotification(payload) {
    var notificationId = 0;
    var token = '';

    try {
        notificationId = payload.data.recordId;
        token = payload.data.token;

        console.log('payload ', payload);

        //show log
        //fetch("/Api/NewsNotifications/Log?id=" + notificationId + "&token=" + token + "&type=2&message=service-worker " + webversion);

        const notificationTitle = payload.data.title.trim();
        const notificationOptions = {
            body: payload.data.body,
            image: payload.data.attachment,
            data: payload,
            requireInteraction: true
        };

        //show duration
        return self.registration.showNotification(notificationTitle, notificationOptions);
            //.then(() => self.registration.getNotifications());
        //.then(notifications => {
        //setTimeout(() => notifications.forEach(notification => notification.close()), 12000);
        //});
    } catch (e) {
        console.log('show notificaion error ', e);
        fetch("/Api/NewsNotifications/Log?id=" + notificationId + "&token=" + token + "&type=4&message=service-worker " + webversion + " -> " + e.message);
    }
}