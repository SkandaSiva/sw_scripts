if('function' === typeof importScripts) {
    const firebaseVersion = '8.9.1';

    importScripts("https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-app.js");
    importScripts("https://www.gstatic.com/firebasejs/" + firebaseVersion + "/firebase-messaging.js");
    addEventListener('message', onMessage);

    function onMessage(e) {
        // do some work here
    }

    // Initialize the Firebase app in the service worker by passing in the
    // messagingSenderId.
    const firebaseConfig = {
        apiKey: "AIzaSyC4fBcSVrExN9ZqQVenzUDBRQKsYn16JkI",
  authDomain: "mapp-push-web.firebaseapp.com",
  projectId: "mapp-push-web",
  storageBucket: "mapp-push-web.appspot.com",
  messagingSenderId: "534672985053",
  appId: "1:534672985053:web:da4c774cda9457bade8434",
  measurementId: "G-XDT11M8EPT"
    };

    firebase.initializeApp(firebaseConfig);

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function(payload) {
        // do some work here

        /*
        if (!payload.notification && payload.webpush && payload.webpush.notification) {
            const notificationTitle = payload.webpush.notification.title;
            const notificationOptions = payload.webpush.notification;

            if (notificationOptions.image && !notificationOptions.icon) {
                notificationOptions.icon = notificationOptions.image;
            }

            return self.registration.showNotification(
                notificationTitle,
                notificationOptions
            );
        }
        */
    });
}
