const subscriptionChange = event => event.waitUntil(clients.matchAll({ type: "window" }).then(clientList => clientList[0] && clientList[0].postMessage({ action: 'pushsubscriptionchange' })));
const showNotification = data => self.registration.showNotification(data.title, data);
const notificationClick = event =>/*  console.log('On notification click: ', event, clients); || */ event.waitUntil(clients.matchAll({ type: "window" }).then(clientList => {
    // console.log(clientList);
    let action = event.action || event.notification.data.actionF || null;
    if (action) {
        if (action === 'reload')
            clientList.forEach(client => 'navigate' in client && client.navigate(client.url));
        else if (action === 'openurl' && event.notification.data && event.notification.data.url)
            clients.openWindow(event.notification.data.url);
    }
    else {
        for (let i = 0; i < clientList.length; i++)
            if (clientList[i].url.replace(/\/$/, '') === new URL(clientList[i].url).origin && 'focus' in clientList[i])
                return clientList[i].focus();
        'openWindow' in clients && clients.openWindow('/');
    }
}));
self.addEventListener('install', event =>/*  console.log('calling install') || */ event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event =>/*  console.log('calling activate') || */ event.waitUntil(clients.claim()));
self.addEventListener('pushsubscriptionchange', subscriptionChange);
self.addEventListener('push', event => self.Notification && self.Notification.permission === 'granted' && event.data && event.waitUntil(showNotification(event.data.json())));
self.addEventListener('notificationclick', notificationClick);
// self.addEventListener('fetch', (e) => console.log('calling fetch', e));