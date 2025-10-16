"use strict";

const appUrl   = 'https://www.smartrc.jp/v3/';
const postWait = 1000;

self.addEventListener('install', (ev)=> {
    ev.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (ev)=> {
    ev.waitUntil(self.clients.claim());
});
self.addEventListener('message', (ev) => {
});
self.addEventListener('push', function (ev) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    const sendNotification = json => {
        const mar=json.body.split(',');
        return self.registration.showNotification(json.title, json);
    };

    if (ev.data) {
        ev.waitUntil(sendNotification(ev.data.json()));
    }
});
self.addEventListener('notificationclick', (event) => {
    const mar=event.notification.body.split(',');

    const sendPostMessage = ev => {
        return self.clients.matchAll({
            type: 'window', includeUncontrolled: true
        }).then(function(windowClients) {
            if( windowClients.length ){
                let client = windowClients[0];
                if ('focus' in client) {
                    client.focus();
                    return client.postMessage({
                        msg: mar[1],
                        url: appUrl
                    });
                }
            } else {
                self.clients.openWindow(
                    appUrl
                ).then( function(win){
                    wait(postWait).then( ()=> win.postMessage({
                        msg: mar[1],
                        url: appUrl
                    }));
                    return;
                });
            }
        })
    };
    event.waitUntil(sendPostMessage(event));
});
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
