'use strict';
var configuration = configuration || {version: "js-1", offlineMode : true};


self.addEventListener('install', () => {
    if (!configuration.offlineMode) {
        return;
    }
    caches.open('static-cache').then(cache => {
        return cache.addAll([
            '/',
            '/assets/css/base.min.css?v=v1-01-12-2020',
            '/assets/js/common.min.js?v=v1-01-12-2020',
        ]);
    }).then(() => {
        // `skipWaiting()` forces the waiting ServiceWorker to become the
        // active ServiceWorker, triggering the `onactivate` event.
        // Together with `Clients.claim()` this allows a worker to take effect
        // immediately in the client(s).
        return self.skipWaiting();
    });
});

self.addEventListener('push', function(event) {

    var url;

    try {

        var data = event.data.json();
        console.log(data);

        var title = data.title;
        var options = data.options;

        event.waitUntil(self.registration.showNotification(title, options));

    } catch (err) {

        /*
        url = '/index.php/cod.tracking_push_notification';
        event.waitUntil(fetch(url, {
            method: 'post',
            async: false,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'tracking=error&message=' + encodeURI(err.message)
        }));*/
    }
});

self.addEventListener('notificationclick', function(event) {

    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.link)
    );
});

self.addEventListener('notificationclose', function(event) {
    event.notification.close();
    var baseSiteUrl = event.notification.data.link.split('/index.php')[0];
    var tracking = event.notification.data.link.split('/tracking.')[1].split('/')[0];

    var url = baseSiteUrl + '/index.php/cod.tracking_push_notification';
    event.waitUntil(fetch(url, {
        method: 'post',
        async: false,
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'tracking=event&event=close&userId=' + event.notification.data.suid + '&vv=' + tracking + '&ve=' + configuration.version
    }));
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});