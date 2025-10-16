

//
self.addEventListener('install', function(event) {
    self.skipWaiting();
});


//
self.addEventListener('activate', function(event) {
    if ('clients' in self && self.clients.claim) {
        event.waitUntil(self.clients.claim());
    }
});


//
self.addEventListener('fetch', function(event) {});


//
//
self.addEventListener('pushsubscriptionchange', function(event) {
    //
    //
    console.debug('pushsubscriptionchange event called:', event);
    
    event.waitUntil(
        //
        self.clients.matchAll()
        .then(function(clientList) {
            clientList.forEach(function(client) {
                //
                //
                client.postMessage({ message: 'push_subscribe' });
            });
        })
    );
});


self.addEventListener('push', function(event) {
    console.log('Service worker got push message: ', event);

    var promises;
    
    function make_notification_options(backend_data) {
        var opt = {
            requireInteraction: true,
            renotify: true,
            body: backend_data.message,
            icon: backend_data.icon,
            tag: backend_data.tag,
            data: {
                url: backend_data.url,
                closings_stat_url: backend_data.closings_stat_url
            }
        };
        if (backend_data.image) {
            opt.image = backend_data.image;
        }
        return opt;
    }
    
    var payload = (event.data) ? event.data.json() : null;
    console.log('Payload received: ', payload);
    if (payload) {
        var options = make_notification_options(payload);
        promises = fetch(payload.views_stat_url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(function(response) {
            return self.registration.showNotification(payload.title, options);
        })
        .catch(function(e) {
            console.error('Unable to save statistics', e);
            //
            //
            return self.registration.showNotification(payload.title, options);
        });
    //
    } else {
        //
        //
        var last_notification_url = '/push/last_notification/';
        promises = fetch(last_notification_url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.debug('Data from '+last_notification_url+': ', data);
            if (data.error || !data.notification) {
                console.error('The API returned an error.', data.error);  
                throw new Error();
            }
            return self.registration.showNotification(
                data.notification.title,
                make_notification_options(data.notification)
            );
        })
        .catch(function(e) {
            console.error('Unable to retrieve data', e);
            //
            //
            //
            return self.registration.showNotification('Произошла ошибка', {
                body: 'Не удалось получить уведомление с сайта',
                tag: 'notification-error'
            });
        });
    }
    event.waitUntil(promises);
});


function escapeRegExp(s) {
    return String(s).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


self.addEventListener('notificationclick', function(event) {
    console.log('On notification click event: ', event);
    
    var notification = event.notification;
    notification.close();
    var url = (notification.data && 'url' in notification.data) ? notification.data.url : '/';
    
    //
    event.waitUntil(
        clients.matchAll({ type: "window" })
        .then(function(clientList) {
            //
            //
            //
            var match_url = String(url).replace(/\?from\=[^\?\&\/]+$/, '');
            var url_re = new RegExp(
                "^(?:[hH]{1}[tT]{2}[pP]{1}[sS]{0,1}\\:\\/\\/[^\\/]{4,})?" +
                "(?:" + escapeRegExp(match_url) + "|" + escapeRegExp(url) + ")$"
            );
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if ('focus' in client && url_re.test(client.url)) {
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});


//
//
self.addEventListener('notificationclose', function(event) {
    console.log('On notification closed event: ', event);
    
    event.waitUntil(
        fetch(event.notification.data.closings_stat_url, {
            method: 'GET',
            credentials: 'include'
        })
    );
});
