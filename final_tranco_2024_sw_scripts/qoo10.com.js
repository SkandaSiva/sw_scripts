'use strict';

var notificationclick_url = "";

self.addEventListener('install', function (event) {
    console.log('Installed', event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
    console.log('Activated', event);
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
    console.log('push', event);

    event.waitUntil(
        registration.pushManager.getSubscription().then(function (subscription) {
            console.log("got subscription id: ", subscription.endpoint);

            var endpointSplit = subscription.endpoint.split('/');
            var device_token = endpointSplit[endpointSplit.length - 1];

            var API_ENDPOINT = "/gmkt.inc/WebPush/Chrome/ServiceWorkerGetPushMsg.ashx?device_token=" + device_token;
            fetch(API_ENDPOINT).then(function (response) {
                console.log("response", response);
                console.log("fetch", subscription.endpoint);

                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    throw new Error();
                }

                // Examine the text in the response
                return response.json().then(function (data) {
                    var title = data.title;
                    var message = data.message;
                    var icon = data.icon;
                    var tag = data.tag;
                    notificationclick_url = data.notificationclick_url;

                    if (title != "" && message != "" && icon != "" && notificationclick_url != "") {

                        self.registration.showNotification(title, {
                            body: message,
                            icon: icon,
                            tag: tag,
                            vibrate: [200]
                        })
                    }
                }) //response.json()	
            }) //fetch
        }) //getSubscription
    ) //event.waitUntil
}); //addEventListener


self.addEventListener('notificationclick', function (event) {
    console.log('Notification click: tag ', event.notification.tag);
    event.notification.close();
    var url = notificationclick_url;

    if (url != "") {
        console.log('Notification url : ' + url);
        event.waitUntil(
            clients.matchAll({
                type: 'window'
            })
                .then(function (windowClients) {
                    for (var i = 0; i < windowClients.length; i++) {
                        var client = windowClients[i];
                        if (client.url === url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    if (clients.openWindow) {
                        return clients.openWindow(url);
                    }
                })
        );
        notificationclick_url = "";
    }
});