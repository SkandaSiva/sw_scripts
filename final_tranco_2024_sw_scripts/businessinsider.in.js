// public/service-worker.js
importScripts('https://static.growthrx.in/js/v2/push-sw.js');

self.addEventListener('notification_received', function(e) {
    console.log("Listener: notification_received", e.detail);
});

self.addEventListener('notification_opened', function(e) {
    console.log("Listener: notification_opened", e.detail);
});

self.addEventListener('notification_closed', function(e) {
    console.log("Listener: notification_closed", e.detail);
});
