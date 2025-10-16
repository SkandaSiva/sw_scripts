self.addEventListener('install', event => {
    console.log("Service Worker Installato");
    self.skipWaiting();
});

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    } 
    const sendNotification = body => {
        const title = body['title'];
        if (body['channel_id']) {
            let fetchRes = fetch('https://re-02.magellanotech.it' + '/api/beaconpush.gif/?site_name=ilromanista.it&push_send_id=' + body['push_send_id'] + '&event_name=' + 'view'  + '&channel_id=' + body['channel_id']);  
            fetchRes.then(res => 
                res.json()).then(d => { 
                    console.log(d) 
                }); 
        } else {
            let fetchRes = fetch('https://re-02.magellanotech.it' + '/api/beaconpush.gif/?site_name=ilromanista.it&push_send_id=' + body['push_send_id'] + '&event_name=' + 'view'  + '&channel_id=0');  
            fetchRes.then(res => 
                res.json()).then(d => { 
                    console.log(d) 
                }); 
        }  
        return self.registration.showNotification(title, body);
    };

    if (event.data) {
        const message = event.data.json();
        event.waitUntil(sendNotification(message));
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var d = event.notification.data.url;
    var push_send_id = event.notification.data.push_send_id; 
    if (event.notification.data.channel_id) {
            let fetchRes = fetch('https://re-02.magellanotech.it' + '/api/push/?site_name=ilromanista.it&push_send_id=' + push_send_id + '&event_name=' + 'click'  + '&channel_id=' + event.notification.data.channel_id);  
            fetchRes.then(res => 
                res.json()).then(d => { 
                    console.log(d) 
                }); 
        } else {
            let fetchRes = fetch('https://re-02.magellanotech.it' + '/api/push/?site_name=ilromanista.it&push_send_id=' + push_send_id + '&event_name=' + 'click'  + '&channel_id=0');  
            fetchRes.then(res => 
                res.json()).then(d => { 
                    console.log(d) 
                }); 
        }  
        
    event.waitUntil(
      clients.openWindow(d)
	);
});
