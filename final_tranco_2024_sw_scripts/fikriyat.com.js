var HIDE_NOTIFICATION_AFTER = false;
var apiUrl = 'https://pfikriyat.tmgrup.com.tr';

self.addEventListener('install', function (event) {
    self.skipWaiting();
});

importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyD9P16P88n4ErZL4CoHkCc-QagdKEuaXg8",
    authDomain: "fir-webpush-28ff4.firebaseapp.com",
    databaseURL: "https://fir-webpush-28ff4.firebaseio.com",
    projectId: "fir-webpush-28ff4",
    storageBucket: "fir-webpush-28ff4.appspot.com",
    messagingSenderId: "994314251369",
    appId: "1:994314251369:web:7dc1a52119845470c846f8"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
var recentNotif;

messaging.setBackgroundMessageHandler(function (payload) {
    return showNotification(payload.data);
});

self.addEventListener('message', function (event) {
    return showNotification(event.data.data);
});

self.addEventListener('notificationclick', function (event) {
    if (event.action === 'close') {
        return closeNotifications();
    }

    if (!event.notification || !event.notification.data || !event.notification.data.payload)
        return event.notification.close();
    else {
        event.notification.close();
        return event.waitUntil(
            onNotificationClicked(event)
        );
    }
});

function onNotificationClicked(event) {
    if (clients.openWindow) {
        var url = event.notification.data.payload.ContentUrl;
        if (!url) {
            url = event.notification.data.payload.Url;
        }

        if ((url && url.indexOf('/clickredirect') == -1) || event.notification.data.payload.FirstButtonLink || event.notification.data.payload.SecondButtonLink) {
            var token = '';
            messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    token = currentToken;
                }
            }).catch((err) => {
            }).finally(() => {
                fetch(apiUrl + '/click?pushid=' + event.notification.data.payload.Id + '&token=' + token, {
                    method: 'get',
                    headers: {
                        "Content-Type": "text/plain;charset=UTF-8"
                    },
                    mode: 'cors'
                });
            });
        }
        if (event.action === 'OneClickButton') {
            return clients.openWindow(event.notification.data.payload.FirstButtonLink);
        }
        else if (event.action === 'TwoClickButton') {
            return clients.openWindow(event.notification.data.payload.SecondButtonLink);
        }
        else {
            return clients.openWindow(url)
        }
    }
    return;
}

function showNotification(notification) {
    if (notification == null || (recentNotif && recentNotif.Id == notification.Id))
        return;

    recentNotif = notification;

    var title = notification.Title;
    var body = notification.Body;
    var iconUrl = notification.Logo;
    var tag = notification.Tag;
    var notificationOptionActions = [
        { action: 'open', title: 'Devam Et' }
    ];

    if (notification.ButtonType == "1") {
        notificationOptionActions = [
            {
                action: "OneClickButton",
                title: notification.FirstButtonTitle,
            }
        ];
    }
    else if (notification.ButtonType == "2") {
        notificationOptionActions = [
            {
                action: "OneClickButton",
                title: notification.FirstButtonTitle
            },
            {
                action: 'TwoClickButton',
                title: notification.SecondButtonTitle
            }
        ];
    }

    var notificationOptionImage = "";
    if (notification.LogoType == "2") {
        notificationOptionImage = notification.Image;
    }

    if (HIDE_NOTIFICATION_AFTER) {
        setTimeout(closeNotifications, HIDE_NOTIFICATION_AFTER * 1000);
    }

    if (Math.ceil(Math.random() * 20) == 3) {
        setTimeout(function () {
            fetch(apiUrl + '/impression?s=1&pushid=' + notification.Id, {
                method: 'get',
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8"
                },
                mode: 'cors'
            });
        }, (Math.ceil(Math.random() * 15400)));
    }

    return self.registration.showNotification(title, {
        body: body,
        icon: iconUrl,
        tag: tag,
        image: notificationOptionImage,
        data: { payload: notification },
        actions: notificationOptionActions
    });
}

function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}

function closeNotifications() {
    self.registration.getNotifications().then(function (notifications) {
        for (var i = 0; i < notifications.length; ++i) {
            notifications[i].close();
        }
    });
}