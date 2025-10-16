// NOTE: This file must be in the root of the project, this code is not loaded inline in the HTML
// NOTE: The actual code of this file is in FTP on one higher level. One file is served for each landingpage.
// If you want to change this file, use the FTP user and upload it.
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD3alFpf0X-YeDIx_sLUeB_5a1YxrQ5ANE",
  authDomain: "msd-push-notification.firebaseapp.com",
  databaseURL: "https://msd-push-notification.firebaseio.com",
  projectId: "msd-push-notification",
  storageBucket: "msd-push-notification.appspot.com",
  messagingSenderId: "915983300855",
  appId: "1:915983300855:web:1a05ebfb66d96fb083bbf2",
  measurementId: "G-7SHZ30C8WW"
});
const messaging = firebase.messaging();

/**
 * When you send a test notification from the Firebase Console,
 * it typically includes both a notification and a data payload.
 * This behavior aligns with the insights shared in the provided sources.
 *
 * As mentioned in the sources, Firebase Cloud Messaging (FCM)
 * can handle notifications in two ways:
 *
 * Notification Payload: If the message includes a notification payload, FCM automatically displays the notification.
 * This does not require any manual handling in your service worker or application code.
 *
 * Data Payload: If the message includes only a data payload, it requires manual handling
 * either in your service worker (for background messages) or in your application code
 * (for foreground messages) to display the notification.
 */

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Checks only for Data Payload notifications, others are ignored
    if (payload.data && payload.data.title && payload.data.body) {
        const notificationTitle = payload.data.title;
        const notificationOptions = {
            body: payload.data.body,
            icon: payload.data.icon
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
        console.log('The message payload does not contain the required data.');
    }
});