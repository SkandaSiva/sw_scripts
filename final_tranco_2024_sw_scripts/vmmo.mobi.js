self.addEventListener("install", event => {
    console.log("Service Worker installing.");
});

self.addEventListener("activate", event => {
    console.log("Service Worker activating.");
});

self.addEventListener("fetch", function(event) {
    //console.log("Fetch event "+JSON.stringify(event));
    event.respondWith(fetch(event.request).catch(
        function (e) {
            console.warn("Fetch error: " + e);
        }
    ));
});

if (typeof importScripts === 'function') {

    importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/3.7.2/firebase-messaging.js');

    firebase.initializeApp({
        messagingSenderId: '1081587556728'
    });

    const messaging = firebase.messaging();

    // Customize notification handler
    messaging.setBackgroundMessageHandler(function (payload) {
        console.log('Handling background message', payload);

        // Copy data object to get parameters in the click handler
        payload.data.data = JSON.parse(JSON.stringify(payload.data));

        return self.registration.showNotification(payload.data.title, payload.data);
    });

    self.addEventListener('notificationclick', function (event) {
        console.log('Notification click: tag ', event.notification.tag);
        event.notification.close();
        var url = event.notification.data.click_action || '/';
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
    });

}