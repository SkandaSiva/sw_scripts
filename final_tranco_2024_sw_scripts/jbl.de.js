const notification = async (event_type, data) => {
    const api_url = self.location.origin + '?mod=webpushnotification&func=notification';
    console.log(api_url);
    return fetch(api_url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            event: event_type,
            id: data.id,
        }),
    })
        .then((response) => {
        if (response === undefined || !response.ok) {
            throw new Error('Transfer Error');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Transfer Type');
        }
        return response.json();
    }).then((json) => {
        if (!json.success) {
            if (json.msg) {
                throw new Error(json.msg);
            }
            throw new Error('Undefined server response');
        }
        return json.url;
    });
};
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    const sendNotification = notification => {
        return self.registration.showNotification(notification.title, notification.options);
    };
    if (event.data) {
        console.log(event.data.json());
        const message = event.data.json();
        event.waitUntil(sendNotification(message));
    }
});
self.addEventListener('notificationclick', (event) => {
    const open_url = async () => {
        const url = await notification('click', event.notification.data);
        if (url && url !== '') {
            return clients.openWindow(url);
        }
        else {
            return Promise.resolve();
        }
    };
    event.waitUntil(open_url());
    event.notification.close();
});
self.addEventListener('notificationclose', (event) => {
    notification('close', event.notification.data);
});
self.addEventListener("install", (event) => {
    console.log('SW install');
    self.skipWaiting();
});
//# sourceMappingURL=serviceworker.js.map