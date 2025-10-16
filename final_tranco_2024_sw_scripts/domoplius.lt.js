// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '66611677035'
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const firebase_messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should implement this optional method.
// more info: http://stackoverflow.com/questions/40462414/firebase-cloud-messaging-setbackgroundmessagehandler-not-called
firebase_messaging.setBackgroundMessageHandler( function(event) {

    console.log('Received background notification.');
    console.log(event);

    if (event.data && event.data.message) {
        return showNotification(JSON.parse(event.data.message));
    }

});

// event to force showing recieved notification
self.addEventListener('message', function (event) {

    console.log('Forcing to show notification.');
    console.log(event);

    if (event.data) {
        event.waitUntil(showNotification(event.data));
    }

});

// function that shows a notification message
function showNotification(message) {

    const notificationTitle = message.title;
    const notificationOptions = {
        body: message.body,
        icon: message.icon,
        badge: message.badge,
        requireInteraction: true, // do not auto close notification
        tag: 'dp-saved-search-new-ads', // group to show only last notification message
        data: {
            click_url: message.click_action
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
}

// Bind notification click event
self.addEventListener('notificationclick', function(event) {

    console.log('User clicked on notification.');
    console.log(event);

    // Android doesn`t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    if (event.notification.data && event.notification.data.click_url) {

        var click_url = event.notification.data.click_url;

        // This code forces browser to open notification url
        event.waitUntil( clients.matchAll({
            type: "window"
        }).then( function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == click_url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                var url = click_url;
                return clients.openWindow(url);
            }
        }));
    }
});