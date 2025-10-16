// [START initialize_firebase_in_sw]
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
var queryParams = new URL(location).searchParams;
firebase.initializeApp({
    'projectId': queryParams.get('projectId'),
    'appId': queryParams.get('appId'),
    'databaseURL': queryParams.get('databaseURL'),
    'storageBucket': queryParams.get('storageBucket'),
    'apiKey': queryParams.get('apiKey'),
    'authDomain': queryParams.get('authDomain'),
    'messagingSenderId': queryParams.get('messagingSenderId'),
    'measurementId': queryParams.get('measurementId')
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]



self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var promise = new Promise(function (resolve) {
        setTimeout(resolve, 1000);
    }).then(function () {
        return clients.openWindow(event.notification.data.link);
    });

    event.waitUntil(promise);
});



// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', JSON.stringify(payload));

    // switching from Push to Firebase, no need to customize

    // Customize notification here
    //var notificationTitle = payload.data.title;
    //var notificationOptions = {
    //    body: payload.data.body,
    //    image: payload.data.image,
    //    icon: queryParams.get('icon'),
    //    data: { link: payload.data.link }
    //};
    
    //return self.registration.showNotification(notificationTitle, notificationOptions);
});