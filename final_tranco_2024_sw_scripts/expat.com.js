self.addEventListener('fetch', function (event) {
    /** An empty fetch handler! */
});

self.addEventListener('install', () => {
    self.skipWaiting();
})

self.addEventListener('activate', () => {
    self.clients.claim();
})

self.addEventListener('push', (event) => {
    const data  = event.data && 'json' in event.data ? event.data.json() : {};

    self.sendMessageToClient(data);

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.message,
            data: data,
            icon: data.icon, // 512x512
            badge: data.badge,// 128x128
        })
    );
});

self.sendMessageToClient = async (message) => {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (let client of clientList) {
        if (client.url.includes(message.siteOwner)) {
            client.postMessage(message);
        }
    }
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        openUrl(event.notification.data.url)
    );
})

async function openUrl(url) {
    const  windowClients = await self.clients.matchAll({type: 'window', includeUncontrolled: true})
    for (let index = 0; index < windowClients.length; index++) {
        const client = windowClients[index];
        if (client.url === url && 'focus' in client) {
            return client.focus()
        }
    }

    if (self.clients.openWindow) {
        return self.clients.openWindow(url)
    }

    return null
}