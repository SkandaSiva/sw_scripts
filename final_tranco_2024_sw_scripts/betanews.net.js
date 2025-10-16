'use strict'

self.addEventListener('install', event => {
  self.skipWaiting()
  console.log('Changed service worker file...')
})

self.addEventListener('activate', event => {})

self.addEventListener('fetch', event => {})

self.addEventListener('push', event => {
    try {
        const { notification: nt, data: dt } = event.data.json();
    
        const title = nt.title;
        const options = {
            body: nt.body,
            icon: dt.icon,
            badge: dt.badge,
            image: dt.image,
            data: {
                linkUrl: dt.url
            },
            requireInteraction: true
        };
  
        event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
        console.log(err);
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    var linkUrl = event.notification.data.linkUrl ?
        `${event.notification.data.linkUrl}` :
        'https://www.betanews.net/'

    event.waitUntil(clients.openWindow(linkUrl));
});