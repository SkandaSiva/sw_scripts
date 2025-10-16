self.addEventListener('install', function(event) {
    self.skipWaiting();
    //console.log('Installed fcm-sw.js', event);
});

// Add an event listener to handle notification clicks
self.addEventListener('notificationclick', function(event) {
    // Android doesn't close the notification when you click on it  
    // See: http://crbug.com/463146  
    event.notification.close();

    var url = event.notification.data.url;
    if (event.action == 'customclick' && event.currentTarget.actions.click_action != '') {
        url = event.currentTarget.actions.click_action;
    }

    // This looks to see if the current is already open and  
    // focuses if it is  
    event.waitUntil(
        clients.matchAll({  
            type: "window"  
        })
        .then(function(clientList) {  
            for (var i = 0; i < clientList.length; i++) {  
                var client = clientList[i];  
                if (client.url == '/' && 'focus' in client)  
                    return client.focus();  
            }  
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// Add an event listener to handle notification clicks
self.addEventListener('notificationclose', function(event) {
   //console.log('notification closed!');
});

// Add an event listener to handle notification clicks
self.addEventListener('push', function(event) {
    if (typeof event.data != 'undefined') {
        try {
            data = event.data.json().data;
        } catch (err) {
        }
        var notificationTitle = 'Pricee';
        var notificationOptions = {
            icon: 'https://pricee.com/src/assets/images/pricee_icon.png',
            body: 'Compare and Check Price on Flipkart, Amazon, Paytm and more.',
            image: 'https://pricee.com/src/assets/images/pricee_icon.png',
            data: {
                url: 'https://pricee.com/?notify'
            }
        };

        if (navigator.userAgent.indexOf("Mobile") === -1) {
            notificationOptions.requireInteraction = true;
        }

        if (typeof data === 'undefined') {
            var url = "https://notifications.gadgets360.com/alerts/gadgets360Alerts.json";
            event.waitUntil(
                fetch(url).then(function (response) {
                    if (response.status !== 200) {
                        // Either show a message to the user explaining the error  
                        // or enter a generic message and handle the
                        // onnotificationclick event to direct the user to a web page  
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        throw new Error();
                    }

                    // Examine the text in the response  
                    return response.json().then(function (data) {
                        if (data.error || !data.notification) {
                            console.log('The API returned an error.', data.error);
                            throw new Error();
                        }
                        var title = data.notification.title;
                        var message = data.notification.message;
                        var icon = data.notification.icon;

                        var requireInteractionFlag = false;
                        if (navigator.userAgent.indexOf("Mobile") === -1) {
                            requireInteractionFlag = true;
                        }

                        self.registration.showNotification(title, {
                            body: message,
                            icon: icon,
                            vibrate: [300, 100, 400], // Vibrate 300ms, pause 100ms, then vibrate 400ms
                            tag: data.notification.url,
                            image: data.notification.image,
                            data: {
                                url: data.notification.url
                            },
                            requireInteraction: requireInteractionFlag
                        });
                    });
                }).catch(function (err) {
                    console.log('Unable to retrieve data', err);
                })
            );
        } else {
            notificationTitle = data.title != '' ? data.title : notificationTitle;
            notificationOptions.icon = data.icon != '' ? data.icon : notificationOptions.icon;
            notificationOptions.body = data.body != '' ? data.body : notificationOptions.body;
            notificationOptions.data.url = data.click_action != '' ? data.click_action : notificationOptions.data.url;
            if (data.image != '') {
                notificationOptions.image = data.image
            }
            if (typeof data.actions != 'undefined') {
                actions = JSON.parse(data.actions);
                notificationOptions.actions = [{
                    action: actions.action,
                    title: actions.title,
                    icon: actions.icon,
                }];
            }
            self.registration.showNotification(notificationTitle, notificationOptions);
        }

        if (self.indexedDB) {
            var openRequest = self.indexedDB.open('g360_settings', 1);
            openRequest.onupgradeneeded = function(e) {
                var db = openRequest.result;
                var objectStore = db.createObjectStore('settings', {
                    keyPath: 'type'
                });
                objectStore.createIndex('type', 'type', { unique: true });
            };
            openRequest.onsuccess = function(e) {
                var db = openRequest.result;
                var objectStore = db.transaction('settings', "readwrite").objectStore('settings');
                var current = new Date();
                var lastNotificationTs = current.getTime();
                var item = {
                    type: 'notify',
                    data: {
                        last_notification_ts: lastNotificationTs,
                    }
                };
                objectStore.put(item);
            };
        }
    }
});