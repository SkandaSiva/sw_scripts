self.addEventListener('push', function (event) {
    console.log("push", event);

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = jdata => {
        console.log(jdata);
        // you could refresh a notification badge here with postMessage API
        const title = jdata.title;
        const icon = 'https://masba7a.com/img/logo-masba7a.png';
        return self.registration.showNotification(title, {
            body: jdata.body,
            data: { click_action: jdata.click_action },
            icon,
        });
    };

    if (event.data) {
        // console.log(event.data);
        const jdata = JSON.parse(event.data.text());;
        event.waitUntil(sendNotification(jdata));
    }
});

self.addEventListener('notificationclick', function (event) {
    // console.log("notificationclick", event);
    console.log(event.notification);
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                if (clients.openWindow) {
                    console.log(event.notification.data);
                    if (event.notification.data && event.notification.data.click_action) {
                        return clients.openWindow(event.notification.data.click_action);
                    } else {
                        return clients.openWindow('https://masba7a.com/');
                    }
                }
            })
    );
});

self.addEventListener("fetch", function(event){

});