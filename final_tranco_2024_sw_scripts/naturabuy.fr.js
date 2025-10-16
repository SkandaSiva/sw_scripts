self.addEventListener('install', function (event) {
    // console.log('Service worker installing...');
    self.force_utm_source = null;
    self.force_utm_medium = null;

    // Allow re-installation of the service worker if it has changed, even if previous one is still activated
    // However, browser will not detect that service worker has changed since it uses the http cache to get it.
    // To by pass that, you have to increment version in each pwa.js file
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    // console.log('Service worker activating...');
});

/* There is a known issue with csp-report and the fetch override on Chrome browser.
See https://stackoverflow.com/questions/51064652/csp-report-request-doesnt-works-when-called-by-fetch-in-a-service-worker-in-chr
e.g. the Content-Disposition would not be taken into account */
/* Chrome 71 problem with printing pdf with service worker on  */
self.addEventListener('fetch', function (event) {

    var disabledreferrersfetch = ["\x2F\x69\x78\x65\x64\x2F", "\x7A\x74\x6F\x6F\x6C\x73"];

    var disabledurlsfetch = ["\x2F\x69\x78\x65\x64\x2F", "\x7A\x74\x6F\x6F\x6C\x73", 'files/matmut-chasse/', 'https://widget.mondialrelay.com', 'includes/ajax/mondialRelay.php?action=showTicket', 'trustingdocs.php?getdoc', 'gettrusteddoc.php', 'facture.php?printinvoice', 'yourauctions_sold.php?printBL', 'document_vendeur.php', 'sellerlabels.php', 'sellerinvoices.php'];

    // check referrers
    for (var i = 0; i < disabledreferrersfetch.length; i++) {
        if (event.request.referrer.indexOf(disabledreferrersfetch[i]) !== -1) {
            return;
        }
    }

    // check urls
    for (var j = 0; j < disabledurlsfetch.length; j++) {
        if (event.request.url.indexOf(disabledurlsfetch[j]) !== -1) {
            return;
        }
    }

   const url = new URL(event.request.clone().url);

    // we want to add a utm_source and utm_medium parameter to the next same origin GET request
    if (self.force_utm_source !== null
        && self.force_utm_source
        && event.request.method === 'GET'
        && event.request.mode === 'navigate'
        && url.origin === this.origin
    ) {
        if (!url.searchParams.has('utm_source')) {
            url.searchParams.append("utm_source", self.force_utm_source);
        }

        if (self.force_utm_medium !== null && self.force_utm_medium && !url.searchParams.has('utm_medium')) {
            url.searchParams.append("utm_medium", self.force_utm_medium);
        }

        self.force_utm_source = null;
        self.force_utm_medium = null;

        const newRequest = new Request(url.toString());
        event.respondWith(fetch(newRequest));
        return;
    }

    // classic response
    event.respondWith(fetch(event.request));
});

var refreshPushSubscription = function () {
    let urlBase64ToUint8Array = function (base64String) {
        let padding = '='.repeat((4 - base64String.length % 4) % 4);
        let base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        let rawData = self.atob(base64);
        let outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };
    let applicationServerKey = "BD90CgxJdkyu4BPwUGVX_7yNFI-XFiM2zrrtBWO8Mt_7vqTEf81VkdjkN00-pIJ0SkCdlUAs3f8eIiCI7NsDc34";
    self.registration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .then(function () {
            return self.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
            });
        })
        .then(function (subscription) {

            var key = subscription.getKey('p256dh');
            var token = subscription.getKey('auth');
            var contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

            return fetch('/includes/ajax/pushSubscription.php', {
                method: 'POST',
                body: JSON.stringify({
                    platform: 'web-push',
                    endpoint: subscription.endpoint,
                    publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                    authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
                    contentEncoding: contentEncoding,
                    expirationTime: subscription.expirationTime
                }),
                credentials: "same-origin"
            });
                // .then(function () {
                //     sessionStorage.setItem('subscriptionSentToServer', subscription.endpoint);
                //     return subscription;
                // });
        })
        .catch(function (error) {
            console.error('Failed to resubscribe:', error);
        });
}

self.addEventListener('push', function (event) {
    if (!self.Notification || self.Notification.permission !== 'granted') {
        return;
    }

    // To avoid subscriptions expiration we systematically resub devices when receiving push
    refreshPushSubscription();

    var sendNotification = function (notificationId, title, body, bodyWhenGrouped, groupId, targetLink, targetLinkWhenGrouped, icon, image, actions, additionalData) {

        return registration.getNotifications()
            .then(notifications => {
                var currentNotification;

                // Look for notification with same type
                for (var i = 0; i < notifications.length; i++) {
                    if (notifications[i].data &&
                        notifications[i].data.groupId === groupId) {
                        currentNotification = notifications[i];
                        break;
                    }
                }

                return currentNotification;
            }).then(function (currentNotification) {
                var notificationTitle = title;
                var options = {
                    badge: "images/notification-badge.png",
                    icon: icon == "" ? "android-icon.png" : icon,
                    vibrate: [100, 50, 100],
                    actions: [{
                        action: 'config',
                        title: 'Réglages',
                        icon: 'images/cog.png'
                    }, {
                        action: 'disable-notification-type',
                        title: 'Désactiver ce type de notification',
                        icon: 'images/cog.png'
                    }]
                };

                if (image !== "") {
                    options.image = image;
                }

                if (Array.isArray(actions)) {
                    options.actions = [];
                    [].forEach.call(actions, function (action) {
                        options.actions.push(action);
                    }.bind(options));
                }

                // There is already a notification of the same type and there is a group message for this type
                if (currentNotification && bodyWhenGrouped != null && bodyWhenGrouped !== "") {
                    const groupedNotificationCount = currentNotification.data.groupedNotificationCount + 1;

                    var notificationIds = [];
                    if (currentNotification.data.notificationId != undefined) {
                        notificationIds = [notificationId, currentNotification.data.notificationId];
                    } else {
                        notificationIds = currentNotification.data.notificationIds;
                        notificationIds.push(notificationId);
                    }

                    // new notification will contains group message
                    options.body = bodyWhenGrouped.replace('<#count#>', groupedNotificationCount);
                    options.icon = currentNotification.data.icon;
                    options.data = {
                        notificationIds: notificationIds,
                        groupId: groupId,
                        targetLink: targetLinkWhenGrouped,
                        groupedNotificationCount: groupedNotificationCount,
                        icon: options.icon,
                        additionalData: additionalData
                    };

                    // remove old one
                    currentNotification.close();
                } else {
                    options.body = body;
                    options.data = {
                        notificationId: notificationId,
                        groupId: groupId,
                        targetLink: targetLink,
                        groupedNotificationCount: 1,
                        icon: options.icon,
                        additionalData: additionalData
                    };
                }

                return self.registration.showNotification(notificationTitle, options);
            });
    };

    if (event.data) {
        var payload = event.data.json();
        event.waitUntil(sendNotification(payload['id'], payload['title'], payload['body'], payload['group_push_message'], payload['notification_typeid'], payload['target_link'], payload['target_page'], payload['pict_url'], payload['image_url'], payload['actions'], payload['additional_data']));
    }
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;

    var data = new FormData();
    if (notification.data.notificationId !== undefined) {
        data.append('notificationId', parseInt(notification.data.notificationId, 10));
    } else {
        data.append('notificationIds', notification.data.notificationIds);
    }

    if (!e.action) {
        // Set notification or group of notification as read
        data.append('action', 'setNotificationAsRead');
        fetch("/includes/ajax/notification.php",
            {
                method: "POST",
                body: data,
                credentials: "same-origin"
            });

        clients.openWindow(notification.data.targetLink);
        notification.close();
        return;
    }

    switch (e.action) {
        case 'config':
            if (notification.data.additionalData != null && notification.data.additionalData.favorite_search_id !== undefined) {
                clients.openWindow('to_watch.php');
                break;
            }
            clients.openWindow('PushConfig.php');
            break;
        default:
            data.append('action', 'notificationButtonAction');
            data.append('buttonAction', e.action);
            if (notification.data.additionalData !== undefined && notification.data.additionalData !== null) {
                data.append('additionalData', JSON.stringify(notification.data.additionalData));
            }
            var postActionPromise = fetch("/includes/ajax/notification.php",
                {
                    method: "POST",
                    body: data,
                    credentials: "same-origin"
                }).then(async function (response) {
                await response.json().then(function (responseJson) {
                    if (responseJson['pageToOpen'] !== undefined) {
                        clients.openWindow(responseJson['pageToOpen']);
                    }
                    if (responseJson['messageToShow'] !== undefined) {
                        self.registration.showNotification(responseJson['messageToShow'], {silent: true});
                    }
                }.bind(clients));
            }.bind(clients));
            e.waitUntil(postActionPromise);
            break;
    }
    notification.close();
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ADD_UTM_SOURCE_INFO') {
        self.force_utm_source = event.data.value;
        self.force_utm_medium = event.data.utmMedium;
    }
});
