'use strict';

self.addEventListener('push', function(event) {
    var data;
    if (typeof event.data !== "undefined"
     && (data = JSON.parse(event.data.text()))
     && typeof data.title !== "undefined"
     && typeof data.body !== "undefined"
     && typeof data.icon !== "undefined") {
        var title = data.title;
        var options = {
            body: data.body,
            icon: data.icon,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            //timestamp: Date.now(),
            tag: data.title.replace(/[\W]/g, "_")
        }
        event.waitUntil(self.registration.showNotification(title, options).then((function(data) {
                                                                                    return function(event) {
                                                                                        fetch(data.link + "&action=impression");
                                                                                    }
                                                                                })(data))
                       );
    }
    
    var hndrl = (function (data) {
        return function(event) {
            event.notification.close();
            if (typeof data.link !== "") {
                event.waitUntil(clients.openWindow(data.link + "&action=clickThrough"));
                data.link = "";
            }
            self.removeEventListener("notificationclick", hndrl);
        }
    })(data)
    if (typeof data.link !== "undefined") self.addEventListener('notificationclick', hndrl);
});