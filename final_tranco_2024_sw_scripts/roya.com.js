importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');
//noinspection JSUnresolvedVariable,JSUnresolvedFunction
firebase.initializeApp({
    apiKey: "AIzaSyB39vZx6d5hgmq40bTMs280rLPQSvSNFOo",
    authDomain: "royacom-notifications.firebaseapp.com",
    databaseURL: "https://royacom-notifications.firebaseio.com",
    projectId: "royacom-notifications",
    storageBucket: "royacom-notifications.appspot.com",
    messagingSenderId: "654495725846"
  });

//noinspection JSUnresolvedVariable
const messaging = firebase.messaging();

//noinspection JSUnresolvedFunction
messaging.setBackgroundMessageHandler(function (payload) {

    // Customize notification here
    //noinspection JSUnresolvedVariable
    const notificationOptions = JSON.parse(payload.data.notification);
    const notificationTitle = notificationOptions.title;
    const url = payload.data.url || '';

    notificationOptions.data = {
        url: url
    };

    //noinspection JSUnresolvedVariable
    return self.registration.showNotification(notificationTitle,notificationOptions);
});


self.addEventListener('notificationclick', function(event) {

    var url = event['notification']['data']['url'] || '';
    if (url !== '') {

        //  Android doesn't close the notification when you click on it. See: http://crbug.com/463146
        //noinspection JSUnresolvedVariable
        event.notification.close();

        // This looks to see if the current is already open and focuses if it is
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        event.waitUntil(
            clients.matchAll({
                type: "window"
            }).then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === url && 'focus' in client)
                        return client.focus();
                }
                //noinspection JSUnresolvedVariable
                if (clients.openWindow) {
                    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
                    return clients.openWindow(url);
                }
            })
        );
    }
});