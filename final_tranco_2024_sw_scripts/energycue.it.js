self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        const title = body['title'];
        var ve = 'https://pushme.magellanotech.it/api/e?site_name=www.energycue.it&push_send_id=' + body['push_send_id'] + '&event_name=view'
        fetch(ve, {
        method: 'get'}).then(response => response.json()).catch(err => {
            //error block
        })
        return self.registration.showNotification(title, body);
    };

    if (event.data) {
        const message = event.data.json();
        event.waitUntil(sendNotification(message));
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var d = 'https://www.energycue.it?nr=' + event.notification.data.url
    var vc = 'https://pushme.magellanotech.it/api/e?site_name=www.energycue.it&push_send_id=' + event.notification.data.push_send_id + '&event_name=click'
        fetch(vc, {
        method: 'get'}).then(response => response.json()).catch(err => {
            //error block
        })
    event.waitUntil(
      clients.openWindow(d)
    );
});