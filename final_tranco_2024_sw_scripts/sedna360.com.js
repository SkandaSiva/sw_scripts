
importScripts('https://www.gstatic.com/firebasejs/3.7.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.4/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyDKYZRCS5KrSSjEgo81CqFBwWmFbMcXL-Q",
    authDomain: "sedna360-1491404174276.firebaseapp.com",
    databaseURL: "https://sedna360-1491404174276.firebaseio.com",
    projectId: "sedna360-1491404174276",
    storageBucket: "sedna360-1491404174276.appspot.com",
    messagingSenderId: "291601897927"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('Background message received ', payload);
    if (payload.data.NotificationType != 3) {
        var notificationTitle = payload.data.title;
        var notificationOptions = {
            body: payload.data.description,
            icon: payload.data.icon
        };

        return self.registration.showNotification(notificationTitle,
            notificationOptions);
    }
});