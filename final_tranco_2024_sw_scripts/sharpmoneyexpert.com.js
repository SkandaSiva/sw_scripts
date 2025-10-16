async function sendToPushServer(event, eData = {}){
    var data = {
        "eventType": event.type,
        "eventData": (event?.notification?.data ?? eData)
    };
    let response = await fetch("https://wpntgglo.com/api/"+"event", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': '01d69d4e9289ca0992948206be640caf',
        },
        body: JSON.stringify(data)
    });
}

self.addEventListener('notificationclick', (event) => {
    let N = event.notification;
    let prom = new Promise((res, rej) => {
        return res()
    })
    if (N.data['clickURL']) {
        prom = clients.openWindow(N.data['clickURL'])
    }
    prom
        .then(() => {
            sendToPushServer(event);
        })
        .then(() => {
            return true;
        })
        .catch((err) => {
            sendToPushServer(event);
        })
    event.waitUntil(prom);
    event.notification.close();
});

self.addEventListener('notificationclose', (event) => {
    sendToPushServer(event);
});

self.addEventListener('push', (event) => {
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    let N = self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            image: data.image,
            tag: data.tag || '1',
            requireInteraction: true,
            actions: [
                {action: 'explore', title: (data.exploreButtonTitle ?? '------>')}
            ],
            data: data
    }).then(sendToPushServer(event, data));

    if (event.data) {
        event.waitUntil(N);
    }
});
//version 1.0.27