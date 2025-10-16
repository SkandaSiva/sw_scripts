console.log('Service Worker Loading...');

self.addEventListener('push', e => {
    const data = e.data.json();
    // console.log('Push Received...', data);
    self.registration.showNotification(data.title, data);
    //{  body: data.body, icon: data.icon, tag }
});

self.addEventListener('notificationclick', function(event) {
    let no = event.notification;
    // console.log('On notification click: ', no);
    no.close();

    let url = no.tag === 'url' ? no.data : '/';
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({type: "window"}).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == url && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow(url);
    }));

});
