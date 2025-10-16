// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

self.addEventListener('notificationclick', function (event) {
    if(typeof(event.notification.data.FCM_MSG) !== 'undefined') {
        var url = event.notification.data.FCM_MSG.data.click_action;
    } else {
        var url = event.notification.data.click_action;
    }

    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener('push', function(event) {
    event.stopImmediatePropagation();

    var data = event.data.json();

    data.data.click_action = data.notification.click_action;

    event.waitUntil(
        self.registration.showNotification(data.notification.title, {
            body: data.notification.body,
            icon: data.notification.icon,
            data: data.data,
            tag: data.notification.tag
        })
    );
});

// Initialize the Firebase app in the service worker by passing in
var firebaseConfig = {
    apiKey: "AIzaSyCACu8n63IbDLJ3dKnVi1wkovbEUM80K7A",
    authDomain: "framework360-1dc08.firebaseapp.com",
    projectId: "framework360-1dc08",
    storageBucket: "framework360-1dc08.appspot.com",
    messagingSenderId: "946164367194",
    appId: "1:946164367194:web:70211cd65c5c7ec9ea7d63"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

/*
messaging.setBackgroundMessageHandler(function (payload) {
    self.registration.hideNotification();
});
*/