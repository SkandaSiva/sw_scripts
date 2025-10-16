
self.addEventListener('push', function(event) {

    var payload = event.data ? event.data.json() : null;

    if (    typeof(payload) !== 'object'
         || payload == null
         || typeof(payload.title) !== 'string'
         || typeof(payload.body)  !== 'string'
         || typeof(payload.icon)  !== 'string'
    ) {
        return;
    }

    var options = {
        lang: 'en',
        icon: payload.icon,
        body: payload.body
    };

    if ( Array.isArray(payload.vibrate) ) {
        options.vibrate = payload.vibrate;
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );

});

self.addEventListener('notificationclick', function(event) {

    event.waitUntil( 
        self.clients.matchAll().then(function(clientList) {

            if (clientList.length > 0) {
                return clientList[0].focus();
            }

            return self.clients.openWindow('/');
        })
    );

});