// Get serviceWorker.scriptURL and if sandbox
var queryStringD = serviceWorker.scriptURL.split("?")[1];

// Import scripts for Firebase
importScripts("firebase-app.js");
importScripts("firebase-messaging.js");
importScripts("firebase-credential.js?" + queryStringD);

const messaging = firebase.messaging();

// Background notification handler - Foreground notifications are handled in index.js
// messaging.onBackgroundMessage((payload) => {

//     // Init notification
//     var notification_payload = payload.notification;

//     // Get webpush data
//     var webpush = payload.webpush?.notification;

//     // Build notification options
//     let notificationOptions = {
//         body: notification_payload.body,
//         badge: webpush.badge,
//         icon: webpush.icon,
//         tag: payload?.data?.link
//     }

//     // Show the notification
//     self.registration.showNotification(notification_payload.title, notificationOptions);

// });

// // Check if clicked
// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();

//     console.log("SW Click", event);

//     // Check if url is empty
//     if (event.notification.tag == null || event.notification.tag == undefined || event.notification.tag == "")
//         return;

//     // Redirect to the link
//     clients.openWindow(event.notification.tag);
// });