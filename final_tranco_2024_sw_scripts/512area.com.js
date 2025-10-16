self.addEventListener('push', function (event) {
    if(!(self.Notification && self.Notification.permission==='granted')){return;}

    const sendNotification=function(body, title, icon2, ock){
        return self.registration.showNotification(title, {
            body,icon:icon2,data:ock
        });
    };

    if(event.data){
        const message = event.data.text();
		const jsobj=JSON.parse(message);
        event.waitUntil(sendNotification(jsobj.body, jsobj.title, jsobj.icon, jsobj.click));
    }
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	event.waitUntil(clients.matchAll({
		type: "window"
	}).then(function(clientList){

		for(var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url == '/' && 'focus' in client)
				return client.focus();
		}
		if (event.notification && event.notification.data)
			return clients.openWindow(event.notification.data);
		if (clients.openWindow)
			return clients.openWindow('/');
	}));
});