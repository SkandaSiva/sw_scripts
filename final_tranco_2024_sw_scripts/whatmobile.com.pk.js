// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
importScripts('js/fcmp/init.js?v=1.0');
importScripts('js/fcmp/wm-service.js?v=1.0');

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app(); // if already initialized, use the existing app
}
// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();
var wmService = new WMService();

// Background Message Handler
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Extract notification details from the payload
  const notificationTitle = payload.data.title || 'Notification Title';
  const notificationOptions = {
    body: payload.data.body || 'Notification body',
    icon: payload.data.icon || '/firebase-logo.png',
    image: payload.data.image || null,
    badge: payload.data.badge || null,
    requireInteraction: payload.data.requireInteraction === 'true',  // Requires interaction before it can be closed
    data: {
      // Removed optional chaining; checks are now manual
      click_action: (payload.fcm_options && payload.fcm_options.link) || payload.data.click_action,  // Link to open when notification is clicked
      message_id: payload.data.message_id  // Capture message_id for stats
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click action
self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // Close the notification

  // Extract the link or action from the notification data
  const click_action = event.notification.data.click_action;
  
  if (click_action) {
    event.waitUntil(
      clients.openWindow(click_action).then(() => {
        // Update stats after successfully handling the click
        if (event.notification.data.message_id) {
          wmService.updateStats(event.notification.data.message_id, 'clicked');
        }
      })
    ); // Open the provided URL in a new tab/window
  }
});

// Ensure that the notification close event is handled and stats are updated if needed
self.addEventListener('notificationclose', function (event) {
  if (event.notification.data.message_id) {
    wmService.updateStats(event.notification.data.message_id, 'dismissed');
  }
});