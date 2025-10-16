// Caching Constants
const cacheName = 'v1.32';
const cacheAssets = ['/fonts/fontawesome-webfont.eot', '/fonts/fontawesome-webfont.woff', '/fonts/fontawesome-webfont.woff2', '/Scripts/PWA.js', '/Content/foundation-min.css', '/Content/switch-min.css', '/Content/pretty-inputs.css', '/Content/fontawesome/fontawesome.min.css'];

// Call Install Event
self.addEventListener('install', e => {
    console.log("Service worker: Installed.");

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log("Service worker: Activated.");
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log("Service Worker: Cleaning Old Cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).catch(function (error) {
            caches.match(event.request).catch(function (e) {
                console.log(event.request + ' - ' + e);
            });
            console.log('Service Worker: Offline ' + error);
        }
        ));
});

self.addEventListener('load', function () {
    console.log("Loaded");
    function updateOnlineStatus(event) {
        var condition = navigator.onLine ? "online" : "offline";

        console.log("beforeend", "Event: " + event.type + "; Status: " + condition);
    }

    this.self.addEventListener('online', updateOnlineStatus);
    this.self.addEventListener('offline', updateOnlineStatus);
});


self.addEventListener('push', function (event) {

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var object = event.data.json();

    var data = object;

    var title = data.data["gcm.notification.Title"];
    var message = data.data["gcm.notification.Message"];
    var icon = JSON.stringify(data.data["gcm.notification.Icon"]);
    var _data = data.data["gcm.notification.Data"];
    var actions = data.data["gcm.notification.Actions"];

    event.waitUntil(
        displayNotification(title, message, icon, _data, actions)
    );

});


self.addEventListener('notificationclick', function (event) {
    var s = event.notification.data;
    s = s.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u0019]+/g, "");
    var data = JSON.parse(s);

    //console.log('On notification click: ', event.notification.tag);

    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    var promise = new Promise(function (resolve) {
        setTimeout(resolve, 3000);
    }).then(function () {
        // return the promise returned by openWindow, just in case.
        // Opening any origin only works in Chrome 43+.
        return NavigateWindow(data, event.action);
    });

    // Now wait for the promise to keep the permission alive.
    event.waitUntil(promise);
});

function NavigateWindow(data, action) {
    if (data.URL != "") {
        if (action != "" && action != "Action") {
            return clients.openWindow(data.URL + "/" + action);
        }
        else {
            return clients.openWindow(data.URL);
        }
    }
    else {
        return clients.openWindow('/');
    }
}

function displayNotification(_title, _body, _icon, data, _actions) {
    if (Notification.permission == 'granted') {
        var options = {
            body: _body,
            icon: 'fclogo96.png',
            data: data,
            vibrate: [100, 50, 100],
            actions: JSON.parse(_actions)
        };
        return self.registration.showNotification(_title, options);
    }
    return false;
}

