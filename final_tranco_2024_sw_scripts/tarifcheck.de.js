// 
self.addEventListener('push', (event) => {
const pushData = event.data.json();
event.waitUntil(
self.registration.showNotification(pushData.subject, { 
body: pushData.body, 
icon: '/uploads/tc-icon-192.png',
vibrate: [200, 100, 200, 100, 200, 100, 200], 
badge: '/uploads/tc-notification-badge.png',
actions: [
{
action: 'https://100partnerprogramme.de',
type: 'button',
title: 'Noch mehr Affiliates Entdecken 🔎',
icon: '/uploads/tc-icon-192.png',
}
]
})
);
});
self.addEventListener('install', e => {
// use skipWaiting because the SW does not have any caching initiation
self.skipWaiting();
});
self.addEventListener("activate", (event) => {
event.waitUntil(clients.claim());
});
self.addEventListener('notificationclick', async (event) => {
event.notification.close();
let url = 'https://www.tarifcheck.de/?pid=31425&tcpp_situation=wechsel';
try {
event.waitUntil(clients.openWindow(url));
await fetch('/system/utsevent/', {
method: 'POST',
body: JSON.stringify({
event: 'push_notification_click'
})
});
}
catch(err) {
await fetch('/system/utsevent/', {
method: 'POST',
body: JSON.stringify({
event: 'push_notification_click_error',
anonymous_dimension_1: err.message
})
});
}
});
//