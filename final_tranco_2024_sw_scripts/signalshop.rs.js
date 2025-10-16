// PWA Service Worker with push 

importScripts('/sw.js');

// Firebase Messaging Service Worker
self.addEventListener('push', (event) => {
    const notif = event.data.json().notification;

    event.waitUntil(self.registration.showNotification(notif.title, {
        body: notif.body,
        icon: notif.image,
        data: {
            url: notif.click_action
        }
    }));
})

self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();

    event.waitUntil(clients.openWindow(clickedNotification.data.url));
})
