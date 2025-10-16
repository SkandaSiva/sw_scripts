self.addEventListener('install', function (e) {
    self.skipWaiting()
});
self.addEventListener('activate', function (e) {
    return self.clients.claim()
});
self.addEventListener('fetch', function (e) { });
if ("pushManager" in ServiceWorkerRegistration.prototype) {
    importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');
    var config = {
        apiKey: "AIzaSyCW1Hee4apNbFCwHNDAuD-Us3uiD_lqGM4",
        authDomain: "mdgpushnotification.firebaseapp.com",
        databaseURL: "https://mdgpushnotification.firebaseio.com",
        projectId: "mdgpushnotification",
        storageBucket: "mdgpushnotification.appspot.com",
        messagingSenderId: "739940043123",
        appId: "1:739940043123:web:c17e2132dbc8bd31"
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    self.addEventListener('push', async function (event) {
        var data = event.data.json().data;
        if (data) {
            var notificationTitle = data.title;
            var notificationOptions = {
                body: data.body,
                icon: data.icon,
                image: data.image,
                requireInteraction: !0,
                tag: data.tag,
                badge: data.badge
            };
            notificationOptions.actions = new Array();
            if (data.ActionTitle || data.action_button) {
                notificationOptions.actions.push({
                    action: data.ActionName,
                    title: data.ActionTitle,
                    icon: data.action_button
                })
            }
            if (data.ActionTitle1 || data.action_button1) {
                notificationOptions.actions.push({
                    action: data.ActionName1,
                    title: data.ActionTitle1,
                    icon: data.action_button1
                })
            }
            event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions))
        } else {
            console.log('This push event has no data.')
        }
    });
    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        var redirectUrl = null;
        var tag = event.notification.tag;
        if (event.action) {
            redirectUrl = event.action
        } else if (tag) {
            var arr = tag.split('_MDGDELIM_');
            if (arr[3])
                redirectUrl = arr[3]
        }
        if (redirectUrl == null || redirectUrl == undefined || redirectUrl == '') {
            redirectUrl = '/'
        }
        if (redirectUrl) {
            event.waitUntil(async function () {
                var allClients = await clients.matchAll({
                    includeUncontrolled: !0
                });
                var chatClient;
                for (const client of allClients) {
                    if (redirectUrl != '/' && client.url.indexOf(redirectUrl) >= 0) {
                        try {
                            client.focus();
                        } catch (e) {

                        }
                        chatClient = client;
                        break
                    }
                }
                if (chatClient == null || chatClient == 'undefined') {
                    try {
                        chatClient = clients.openWindow(redirectUrl);
                    } catch (e) {

                    }
                    return chatClient
                }
            }().then(result => {
                if (tag) {
                    PostAction(tag, "click");
                }
            }))
        }
    });
    self.addEventListener("notificationclose", function (event) {
        event.notification.close();
        PostAction(event.notification.tag, "close");
    });

    function PostAction(tag, action) {
        if (tag) {
            var campaignId, recurringId, subscriptionId;
            var arr = tag.split('_MDGDELIM_');
            if (arr[0])
                campaignId = arr[0];
            if (arr[1])
                recurringId = arr[1];
            if (arr[2])
                subscriptionId = arr[2];
            if (subscriptionId !== null && subscriptionId !== undefined && subscriptionId)
                var data = {
                    "action": action,
                    "CampaignId": campaignId,
                    "subscriptionId": subscriptionId,
                    "RecurringId": recurringId
                };
            var domain = location.origin;
            var fetchUrl = domain + '/MDGPush.asmx/UpdatePushNotificationResponse';
            fetch(fetchUrl, {
                method: 'POST',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Headers": "x-requested-with, accept, authorization"
                },
                body: JSON.stringify(data)
            }).then((resp) => { });
        }
    }

}