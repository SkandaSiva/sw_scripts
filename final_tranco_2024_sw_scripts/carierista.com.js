self.addEventListener('push', function (e) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        // notifications aren't supported or permission not granted!
        return;
    }
    var msg = e.data.json();
    const pushDeliveryPromise = fetch('api/push/track/delivery', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ cid: msg.data.cid, sid: msg.data.sid })
    });
    const showPushNotificationPromise = self.registration.showNotification(msg.title, {
        body: msg.body,
        icon: msg.icon,
        image: msg.image,
        data: {
            url: msg.data.url,
            cid: msg.data.cid,
            sid: msg.data.sid
        },
        requireInteraction: true,
        actions: msg.actions
    });
    const promiseChain = Promise.all([
        pushDeliveryPromise,
        showPushNotificationPromise
    ]);
    e.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    var url = e.notification.data.url;
    var cid = e.notification.data.cid;
    var sid = e.notification.data.sid;
    const pushClickPromise = fetch('api/push/track/click', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ cid: cid, sid: sid })
    });
    const urlOpenPromise = clients.openWindow(url);
    const promiseChain = Promise.all([
        pushClickPromise,
        urlOpenPromise
    ]);
    e.waitUntil(promiseChain);
});

self.addEventListener('notificationclose', function(e) {
    e.notification.close();
    var cid = e.notification.data.cid;
    var sid = e.notification.data.sid;
    const pushDismissPromise = fetch('api/push/track/dismiss', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ cid: cid, sid: sid })
    });
    e.waitUntil(pushDismissPromise);
});

self.addEventListener('activate', function (e) {
    console.log('sw activated');
});

self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('pushsubscriptionchange', function (e) {
    console.log(e);
});