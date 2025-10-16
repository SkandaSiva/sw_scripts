// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js');

const config = {
    "apiKey": "AIzaSyDsAOupTeHVNbEhHG3xRJXi3-k_WW7ZBNM",
    "authDomain": "mojeppk-push.firebaseapp.com",
    "databaseURL": "https://mojeppk-push.firebaseio.com",
    "projectId": "mojeppk-push",
    "storageBucket": "mojeppk-push.appspot.com",
    "messagingSenderId": "129722102557",
    "appId": "1:129722102557:web:38e1a9afdf7315497aa7f4"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    const { message: body, icon: image, title, url } = payload.data;
    const { pathname } = self.location,
        isProdAuthor = pathname.includes("mgnl-admin") ? "/mgnl-admin" : "",
        isDevAuthor = pathname.includes("magnoliaAuthor") ? "/magnoliaAuthor" : "",
        instance = isDevAuthor || isProdAuthor;
    const icon = `${instance}/.resources/ppk-module/assets/favicon/favicon.ico`;

    self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        event.waitUntil(
            clients.matchAll({type: 'window'}).then( windowClients => {
                for (const i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
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

    return self.registration.showNotification(title, { body, icon, image });
});

